'use strict';

const recentPublish = (pkg, meta) => {
    if (!meta.time || !meta.time.modified) {
        throw new TypeError('A modified time is required.');
    }
    const today = new Date();
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setUTCDate(today.getUTCDate() - 30);
    const publishTime = new Date(meta.time.modified);
    return publishTime.getTime() >= thirtyDaysAgo.getTime();
};

module.exports = recentPublish;
