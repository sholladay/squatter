'use strict';

const unpublished = (meta) => {
    return Boolean(!meta['dist-tags'] && meta.time && meta.time.unpublished);
};

module.exports = unpublished;
