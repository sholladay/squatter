'use strict';

const semver = require('semver');

const versionPkg = (meta, version = 'latest') => {
    if (!version || typeof version !== 'string') {
        throw new Error('A version is required.');
    }
    const fixed = meta['dist-tags'][version] || semver.maxSatisfying(Object.keys(meta.versions), version);
    const pkg = meta.versions[fixed];

    if (!fixed || !pkg) {
        throw new Error('Version does not exist.');
    }

    return pkg;
};

module.exports = versionPkg;
