const template = require('lodash.template');
const { getTheme } = require('./themes.js');

function renderContributor(contributor, options = {}) {
    const { avatar_url } = contributor;

    return `<li class="contributor"><img src=${avatar_url} width="${options.avatarSize}" /></li>`;
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
        interpolate: /{{([\s\S]+?)}}/g,
    })(data);
}

function render(contributors, options) {
    const theme = getTheme(options.theme);
    const style = renderTemplate(theme, options);

    return `<style>${style}</style>${renderContributors(
        contributors,
        options,
    )}`;
}

module.exports = {
    render,
    renderContributor,
    renderContributors,
    renderTemplate,
};
