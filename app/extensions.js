function getExtension(extension) {
    const validExtensions = {
        jpg: 'jpeg',
        jpeg: 'jpeg',
        png: 'png',
    };

    return validExtensions[extension] || validExtensions['jpeg'];
}

module.exports = { getExtension };
