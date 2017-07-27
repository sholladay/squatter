'use strict';

const hasKeyword = ({ keywords }) => {
    return Array.isArray(keywords) && keywords.some((keyword) => {
        return Boolean(keyword) && typeof keyword === 'string';
    });
};

module.exports = hasKeyword;
