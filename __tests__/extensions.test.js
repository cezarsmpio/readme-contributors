const { getExtension } = require('../extensions');

it('should return jpeg passing jpg', () => {
    expect(getExtension('jpg')).toBe('jpeg');
});

it('should return jpeg passing jpeg', () => {
    expect(getExtension('jpeg')).toBe('jpeg');
});

it('should return png passing png', () => {
    expect(getExtension('png')).toBe('png');
});

it('should return jpeg passing a non valid extension', () => {
    expect(getExtension('svg')).toBe('jpeg');
});

it('should return jpeg passing nothing', () => {
    expect(getExtension()).toBe('jpeg');
});
