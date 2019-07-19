require('dotenv').config();

const chrome = require('chrome-aws-lambda');
const fogo = require('fogo');
const axios = require('axios').default;
const fs = require('fs');
const path = require('path');
const template = require('lodash.template');
const NodeCache = require('node-cache');

const cache = new NodeCache();

const themes = {
    simple: fs
        .readFileSync(path.resolve(__dirname, 'themes', 'simple.css'))
        .toString(),
    dark: fs
        .readFileSync(path.resolve(__dirname, 'themes', 'dark.css'))
        .toString(),
    unicorn: fs
        .readFileSync(path.resolve(__dirname, 'themes', 'unicorn.css'))
        .toString()
};

function getTheme(theme) {
    return themes[theme] || theme['simple'];
}

function renderContributor(contributor, options = {}) {
    const { avatar_url, login } = contributor;

    return `<li class="contributor"><img src=${avatar_url} width="${
        options.avatarSize
    }" /></li>`;
}

function renderContributors(contributors, options) {
    return `<ul class="contributors-list">${contributors
        .map(function(contributor) {
            return renderContributor(contributor, options);
        })
        .join('')}</ul>`;
}

function renderTemplate(content, data) {
    return template(content, {
        interpolate: /{{([\s\S]+?)}}/g
    })(data);
}

function render(contributors, options) {
    const theme = getTheme(options.theme);
    const style = renderTemplate(theme, options);

    return `<style>${style}</style>${renderContributors(
        contributors,
        options
    )}`;
}

function getExtension(extension) {
    const validExtensions = {
        jpg: 'jpeg',
        jpeg: 'jpeg',
        png: 'png'
    };

    return validExtensions[extension] || validExtensions['jpeg'];
}

async function getRepoContributors({ owner, repo, count }) {
    const perPage = Number(count) > 100 ? 100 : count;

    const { data } = await axios.get(
        `https://api.github.com/repos/${owner}/${repo}/contributors?per_page=${perPage}`,
        {
            headers: {
                Authorization: `token ${process.env.GITHUB_TOKEN}`
            }
        }
    );

    return data;
}

module.exports = (async function() {
    const browser = await chrome.puppeteer.launch({
        args: chrome.args,
        executablePath: await chrome.executablePath,
        headless: true
    });

    const server = fogo.createServer({
        '/:owner/:repo': async function(req, res, url, params) {
            const {
                width = false,
                avatarSize = '30',
                avatarRadius = '50',
                spacing = '2',
                theme = 'simple',
                aspectRatio = '2',
                quality = '100',
                count = '30',
                extension = 'jpeg'
            } = url.query;
            const { owner, repo } = params;
            const options = {
                avatarSize,
                avatarRadius,
                spacing,
                theme
            };
            const ext = getExtension(extension);

            if (cache.get(req.url)) {
                res.writeHead(200, { 'Content-Type': `image/${ext}` });
                return res.end(cache.get(req.url));
            }

            try {
                const contributors = await getRepoContributors({
                    owner,
                    repo,
                    count
                });

                const widthAutoSize =
                    contributors.length * Number(avatarSize) +
                    Number(spacing) * contributors.length * 2;

                const page = await browser.newPage();
                await page.setViewport({
                    width: Number(width) || widthAutoSize,
                    height: 900,
                    deviceScaleFactor: Number(aspectRatio)
                });
                await page.setContent(await render(contributors, options));
                const contributorsList = await page.$('.contributors-list');
                const image = await contributorsList.screenshot({
                    type: ext,
                    quality: ext === 'png' ? undefined : Number(quality)
                });

                await page.close();

                cache.set(req.url, image, 604800); // 7 days

                res.writeHead(200, { 'Content-Type': `image/${ext}` });
                return res.end(image);
            } catch (err) {
                console.log(err);

                res.writeHead(200, { 'Content-Type': `image/${ext}` });
                return res.end();
            }
        }
    });

    process.on('exit', async function() {
        await browser.close();
    });

    server.listen(3000);

    return server;
})();
