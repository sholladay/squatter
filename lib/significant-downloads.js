'use strict';

const got = require('got');

const downloadsLastWeek = async (pkgName) => {
    const { body } = await got('https://api.npmjs.org/downloads/point/last-week/' + pkgName, {
        json : true
    });
    return body.downloads;
};

const significantDownloads = async ({ name }) => {
    const numDownloads = await downloadsLastWeek(name);
    return numDownloads > 500;
};

module.exports = significantDownloads;
