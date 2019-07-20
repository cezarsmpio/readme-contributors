const path = require('path');
const fs = require('fs');

const validThemes = ['simple', 'dark', 'unicorn'];

const themes = validThemes.reduce(function(list, theme) {
    list[theme] = fs
        .readFileSync(path.resolve(__dirname, 'themes', `${theme}.css`))
        .toString();

    return list;
}, {});

function getTheme(theme) {
    return themes[theme] || themes['simple'];
}

module.exports = { themes, getTheme };
