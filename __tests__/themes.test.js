const { themes, getTheme } = require('../themes');

jest.mock('fs', function() {
    let i = 1;

    return {
        readFileSync() {
            return {
                toString() {
                    return `body { font-size: ${i++}px; }`;
                },
            };
        },
    };
});

jest.mock('path', function() {
    return {
        resolve() {
            return '/file.css';
        },
    };
});

it('should have the content of each theme', () => {
    expect(themes).toEqual({
        simple: 'body { font-size: 1px; }',
        dark: 'body { font-size: 2px; }',
        unicorn: 'body { font-size: 3px; }',
    });
});

it('should return simple passing simple', () => {
    expect(getTheme('simple')).toBe('body { font-size: 1px; }');
});

it('should return dark passing dark', () => {
    expect(getTheme('dark')).toBe('body { font-size: 2px; }');
});

it('should return unicorn passing unicorn', () => {
    expect(getTheme('unicorn')).toBe('body { font-size: 3px; }');
});

it('should return simple passing an invalid theme', () => {
    expect(getTheme('invalid')).toBe('body { font-size: 1px; }');
});
