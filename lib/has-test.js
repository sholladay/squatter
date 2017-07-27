'use strict';

const hasTest = ({ scripts }) => {
    return Boolean(scripts && scripts.test) &&
        typeof scripts.test === 'string' &&
        !scripts.test.includes('no test specified');
};

module.exports = hasTest;
