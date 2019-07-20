require('dotenv').config();

const chrome = require('chrome-aws-lambda');
const fogo = require('fogo');
const NodeCache = require('node-cache');

const { getExtension } = require('./extensions');
const { getRepoContributors } = require('./repos');
const { render } = require('./render');

const cache = new NodeCache();

const app = (async function() {
    const browser = await chrome.puppeteer.launch({
        args: chrome.args,
        executablePath: await chrome.executablePath,
        headless: true,
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
                extension = 'jpeg',
            } = url.query;
            const { owner, repo } = params;
            const options = {
                avatarSize,
                avatarRadius,
                spacing,
                theme,
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
                    count,
                });

                const widthAutoSize =
                    contributors.length * Number(avatarSize) +
                    Number(spacing) * contributors.length * 2;

                const page = await browser.newPage();
                await page.setViewport({
                    width: Number(width) || widthAutoSize,
                    height: 0,
                    deviceScaleFactor: Number(aspectRatio),
                });
                await page.setContent(await render(contributors, options));
                const contributorsList = await page.$('.contributors-list');
                const image = await contributorsList.screenshot({
                    type: ext,
                    quality: ext === 'png' ? undefined : Number(quality),
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
        },
    });

    process.on('exit', async function() {
        await browser.close();
    });

    server.listen(3000);

    return server;
})();

module.exports = app;
