'use strict';

const semver = require('semver');

const hasProdVersion = ({ version }) => {
    return Boolean(version) && semver.gte(version, '1.0.0');
};

module.exports = hasProdVersion;
