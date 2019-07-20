const {
    render,
    renderContributor,
    renderContributors,
    renderTemplate,
} = require('../render');

jest.mock('../themes.js', function() {
    return {
        getTheme() {
            return 'body { font-size: 16px; }';
        },
    };
});

const contributors = [
    {
        avatar_url: 'https://avatars3.githubusercontent.com/u/0?v=4',
    },
    {
        avatar_url: 'https://avatars3.githubusercontent.com/u/0?v=4',
    },
];

it('should render a contributor item', () => {
    expect(
        renderContributor(contributors[0], { avatarSize: 30 }),
    ).toMatchSnapshot();
});

it('should render a list of contributors', () => {
    expect(
        renderContributors(contributors, { avatarSize: 30 }),
    ).toMatchSnapshot();
});

it('should render', () => {
    expect(
        render(contributors, { theme: 'simple', avatarSize: 25 }),
    ).toMatchSnapshot();
});

it('should render a template', () => {
    expect(
        renderTemplate('Hello, {{ greeting }}!', { greeting: 'world' }),
    ).toBe('Hello, world!');
});

it('should not replace the content of a template', () => {
    expect(renderTemplate('Hey!', { hello: 'world' })).toBe('Hey!');
    expect(renderTemplate('{ hello }', { hello: 'world' })).toBe('{ hello }');
});
