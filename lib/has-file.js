'use strict';

const hasFile = ({ files }) => {
    return Array.isArray(files) && files.some((filePath) => {
        return Boolean(filePath) && typeof filePath === 'string';
    });
};

module.exports = hasFile;
