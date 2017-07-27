'use strict';

const hasReadme = (pkg, { readme }) => {
    return typeof readme === 'string' && readme.trim().length >= 100;
};

module.exports = hasReadme;
