'use strict';

const got = require('got');
const checkDependents = require('check-npm-dependents');

const hasBinary = ({ bin }) => {
    return Boolean(bin) && Object.values(bin).some((filePath) => {
        return Boolean(filePath) && typeof filePath === 'string';
    });
};

const hasDependent = async ({ name }) => {
    if (!name || typeof name !== 'string') {
        throw new TypeError('A package name is required.');
    }

    // The implementation below had to be disabled abruptly because of https://github.com/sindresorhus/npm-name-cli/issues/9

    // const apiUrl = 'https://registry.npmjs.org/-/_view/dependedUpon?' + new URLSearchParams({
    //     // Borrowed from here: https://github.com/chrisdickinson/npm-get-dependents/blob/3e5a82e6039ddb3a638fa0301f356b39bab898d7/index.js#L40-L47
    //     group_level : 2,
    //     startkey    : JSON.stringify([name]),
    //     endkey      : JSON.stringify([name, {}]),
    //     stale       : 'update_after',
    //     skip        : 0,
    //     // The registry seems to use the limit before other filters on the data,
    //     // so we ask for more than we need to ensure we receive a result.
    //     limit       : 1000
    // });
    // const { body } = await got(apiUrl, { json : true });
    // return body.rows.some(({ key }) => {
    //     const dependent = key[1];
    //     return Boolean(dependent) && typeof dependent === 'string';
    // });

    const packageUrl = `https://www.npmjs.com/package/${name}`;
    const { body, statusCode } = await got(packageUrl);
    if (statusCode === 404) {
        throw new Error(`Package does not exist: ${name}`);
    }
    if (statusCode !== 200) {
        throw new Error(`Unable to check dependents for ${name}, got status code ${statusCode}`);
    }
    return checkDependents.parse(body) > 0;
};

const hasBinaryOrDependent = (pkg) => {
    return hasBinary(pkg) || hasDependent(pkg);
};

module.exports = hasBinaryOrDependent;
