# squatter [![Build status for Squatter](https://img.shields.io/circleci/project/sholladay/squatter/master.svg "Build Status")](https://circleci.com/gh/sholladay/squatter "Builds") [![Build status for Squatter on Windows](https://ci.appveyor.com/api/projects/status/5ofux2q7lq6ehk4w/branch/master?svg=true "Windows Build Status")](https://ci.appveyor.com/project/sholladay/squatter "Windows Builds")

> Check if a namespace on npm is being hogged.

## Why?

 - Find out if a package name is worth [disputing](https://docs.npmjs.com/misc/disputes).
 - Filter out low quality packages in tools (e.g. search).
 - Check the quality of your own packages.

## Install

```sh
npm install squatter --save
```

## Usage

Get it into your program.

```js
const squatter = require('squatter');
```

Check whether a given package name is being squatted.

```js
squatter('foo').then((isSquatted) => {
    console.log(isSquatted);  // true
});
squatter('build-path').then((isSquatted) => {
    console.log(isSquatted);  // false
});
```

## Algorithm

A [heuristic](https://en.wikipedia.org/wiki/Heuristic_(computer_science)) is used to determine if a package is a squatter.

A squatter is a package that is not either [exempt](#exemptions), [useful](#usefulness), or [high quality](#quality).

Packages are guilty until proven innocent.

### Exemptions

A package is exempt (aka *not* a squatter) if it has at least **one** of:

 - A new version was published within the last 30 days
 - Significant download activity

### Usefulness

A package is useful (aka *not* a squatter) if it has **all** of:

 - A [README](https://help.github.com/articles/about-readmes/) that is at least 100 characters long
 - Has a [binary](https://docs.npmjs.com/files/package.json#bin) **or** is depended on by another package
 - Its [version](https://docs.npmjs.com/files/package.json#version) is [1.0.0](http://semver.org/#spec-item-4) or higher

### Quality

A package is high quality (aka *not* a squatter) if it has at least **80%** of:

 - Uses non-dev [dependencies](https://docs.npmjs.com/files/package.json#dependencies)
 - Specifies required [engines](https://docs.npmjs.com/files/package.json#engines)
 - Uses a [files](https://docs.npmjs.com/files/package.json#files) whitelist
 - Uses a [test](https://docs.npmjs.com/misc/scripts) script
 - Has [keywords](https://docs.npmjs.com/files/package.json#keywords)
 - Has multiple [maintainers](https://docs.npmjs.com/files/package.json#people-fields-author-contributors)

## API

### squatter(name)

Returns a `Promise` for a `boolean` of whether the name is being hogged on [npm](https://www.npmjs.com/), as determined by [the algorithm](#algorithm).

#### name

Type: `string`<br>
Example: `build-path`

Any valid npm package name.

## Contributing

See our [contributing guidelines](https://github.com/sholladay/squatter/blob/master/CONTRIBUTING.md "The guidelines for participating in this project.") for more details.

1. [Fork it](https://github.com/sholladay/squatter/fork).
2. Make a feature branch: `git checkout -b my-new-feature`
3. Commit your changes: `git commit -am 'Add some feature'`
4. Push to the branch: `git push origin my-new-feature`
5. [Submit a pull request](https://github.com/sholladay/squatter/compare "Submit code to this project for review.").

## License

[MPL-2.0](https://github.com/sholladay/squatter/blob/master/LICENSE "The license for squatter.") © [Seth Holladay](http://seth-holladay.com "Author of squatter.")

Go make something, dang it.
