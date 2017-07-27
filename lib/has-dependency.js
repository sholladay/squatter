'use strict';

const hasDependency = (pkg) => {
    const depTypes = ['dependencies', 'optionalDependencies'];
    return depTypes.some((depType) => {
        return typeof pkg[depType] === 'object' && Object.values(pkg[depType]).some((version) => {
            return Boolean(version) && typeof version === 'string';
        });
    });
};

module.exports = hasDependency;
