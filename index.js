'use strict';

const pOne = require('p-one');
const pEvery = require('p-every');
const fetchMeta = require('package-json');
const getPackage = require('./lib/get-package');
const recentPublish = require('./lib/recent-publish');
const significantDownloads = require('./lib/significant-downloads');
const hasReadme = require('./lib/has-readme');
const hasBinaryOrDependent = require('./lib/has-binary-or-dependent');
const hasProdVersion = require('./lib/has-prod-version');
const hasDependency = require('./lib/has-dependency');
const hasEngine = require('./lib/has-engine');
const hasFile = require('./lib/has-file');
const hasTest = require('./lib/has-test');
const hasKeyword = require('./lib/has-keyword');
const hasExtraMaintainer = require('./lib/has-extra-maintainer');

const exemptions = [
    recentPublish,
    significantDownloads
];
const usefulness = [
    hasReadme,
    hasBinaryOrDependent,
    hasProdVersion
];
const quality = [
    hasDependency,
    hasEngine,
    hasFile,
    hasTest,
    hasKeyword,
    hasExtraMaintainer
];

const squatter = async (name, version = 'latest') => {
    const meta = await fetchMeta(name, {
        allVersions  : true,
        fullMetadata : true
    });
    const pkg = getPackage(meta, version);

    const isExempt = await pOne(exemptions, (test) => {
        return test(pkg, meta);
    });
    if (isExempt) {
        return false;
    }

    const isUseful = await pEvery(usefulness, (test) => {
        return test(pkg, meta);
    });
    if (isUseful) {
        return false;
    }

    const minQualityPercent = 80;
    const passingQuality = (minQualityPercent / 100) * quality.length;
    const qualityScore = quality.reduce((score, test) => {
        return score + Number(test(pkg, meta));
    }, 0);

    return qualityScore < passingQuality;
};

module.exports = squatter;
