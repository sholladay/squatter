'use strict';

const hasExtraMaintainer = ({ maintainers }) => {
    return Array.isArray(maintainers) && maintainers.reduce((total, maintainer) => {
        const isValid = Boolean(maintainer && maintainer.name) && typeof maintainer.name === 'string';
        return total + Number(isValid);
    }, 0) > 1;
};

module.exports = hasExtraMaintainer;
