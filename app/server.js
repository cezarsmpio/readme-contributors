require('dotenv').config();

const chrome = require('chrome-aws-lambda');
const fogo = require('fogo');
const etag = require('etag');

const { cache, ttl } = require('./cache');
const { getExtension } = require('./extensions');
const { getRepoContributors } = require('./repos');
const { render } = require('./render');

const app = (async function() {
    const browser = await chrome.puppeteer.launch({
        args: chrome.args,
        executablePath: await chrome.executablePath,
        headless: true,
    });

    function finishRequest({ res, statusCode, cacheKey, extension }) {
        const future = new Date(cache.getTtl(cacheKey));
        const resource = cache.get(cacheKey);

        res.setHeader('Cache-Control', `max-age=${ttl}`);
        res.setHeader('Expires', future.toUTCString());
        res.setHeader('Etag', resource.etag);
        res.setHeader('Content-Type', `image/${extension}`);
        res.writeHead(statusCode);

        return res.end(resource.image);
    }

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
            const cacheKey = req.url;

            if (cache.get(cacheKey)) {
                return finishRequest({
                    res,
                    statusCode: 200,
                    extension: ext,
                    cacheKey,
                });
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
                const resource = { image, etag: etag(image) };

                await page.close();

                cache.set(cacheKey, resource);

                return finishRequest({
                    res,
                    statusCode: 200,
                    extension: ext,
                    cacheKey,
                });
            } catch (err) {
                res.setHeader('Cache-Control', 'max-age=0');
                res.setHeader('Expires', new Date().toUTCString());
                res.setHeader('Content-Type', `image/${ext}`);
                res.writeHead(200);

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
