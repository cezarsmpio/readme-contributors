const puppeteer = require('puppeteer');
const fogo = require('fogo');
const axios = require('axios').default;

const server = fogo.createServer({
    '/:owner/:repo': async function(req, res, url, params) {
        const { width = '800', height = '800', extension = 'jpeg' } = url.query;
        const { owner, repo } = params;

        console.log({ owner, repo });

        const contributors = await axios.get(
            `https://api.github.com/repos/${owner}/${repo}/contributors`
        );
        console.log(contributors);
        const browser = await puppeteer.launch();
        const page = await browser.newPage();
        await page.setViewport({ width: 1440, height: 900 });
        await page.setContent(
            '<style>h1 { color: red; }</style><h1>Hello</h1>'
        );
        const image = await page.screenshot({ type: extension });

        res.setHeader('content-type', extension);
        res.end(image);
    }
});

server.listen(8080);
