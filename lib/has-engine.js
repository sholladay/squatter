'use strict';

const hasEngine = ({ engines }) => {
    return Boolean(engines) && Object.values(engines).some((version) => {
        return Boolean(version) && typeof version === 'string';
    });
};

module.exports = hasEngine;
