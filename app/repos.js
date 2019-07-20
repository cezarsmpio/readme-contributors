const axios = require('axios');

async function getRepoContributors({ owner, repo, count }) {
    const perPage = Number(count) > 100 ? 100 : count;

    const { data } = await axios.get(
        `https://api.github.com/repos/${owner}/${repo}/contributors?per_page=${perPage}`,
        {
            headers: {
                ...(process.env.GITHUB_TOKEN && {
                    Authorization: `token ${process.env.GITHUB_TOKEN}`,
                }),
            },
        },
    );

    return data;
}

module.exports = { getRepoContributors };
