import test from 'ava';
import recentPublish from './lib/recent-publish';
import significantDownloads from './lib/significant-downloads';
import hasReadme from './lib/has-readme';
import hasBinaryOrDependent from './lib/has-binary-or-dependent';
import hasProdVersion from './lib/has-prod-version';
import hasDependency from './lib/has-dependency';
import hasEngine from './lib/has-engine';
import hasFile from './lib/has-file';
import hasTest from './lib/has-test';
import hasKeyword from './lib/has-keyword';
import hasExtraMaintainer from './lib/has-extra-maintainer';
import squatter from '.';

test('squatter() correctly identifies squatters', async (t) => {
    const squatters = [
        'foo'
    ];
    await Promise.all(squatters.map(async (pkgName) => {
        t.true(await squatter(pkgName), `${pkgName} must be a squatter`);
    }));
});

test('squatter() correctly identifies non-squatters', async (t) => {
    const nonSquatters = [
        'fresh-cli',
        // 'mkdirtemp',
        'build-path',
        'delivr',
        'semver',
        'got',
        'ava'
    ];
    await Promise.all(nonSquatters.map(async (pkgName) => {
        t.false(await squatter(pkgName), `${pkgName} must not be a squatter`);
    }));
});

test('recentPublish() restricts package age', (t) => {
    const fixture = (date) => {
        const meta = {
            time : {
                modified : date.toISOString()
            }
        };
        return recentPublish(null, meta);
    };

    const today = new Date();
    t.true(fixture(today));

    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setUTCDate(today.getUTCDate() - 30);
    t.true(fixture(thirtyDaysAgo));

    const thirtyOneDaysAgo = new Date();
    thirtyOneDaysAgo.setUTCDate(today.getUTCDate() - 31);
    t.false(fixture(thirtyOneDaysAgo));
});

test('significantDownloads() looks for download activity', async (t) => {
    const mockPkg = (name) => {
        return { name };
    };

    const activePkgs = ['got', 'yo'];
    await Promise.all(activePkgs.map(async (pkgName) => {
        const isActive = await significantDownloads(mockPkg(pkgName));
        t.true(isActive, `${pkgName} has many downloads`);
    }));

    const inactivePkgs = ['foo', 'bar'];
    await Promise.all(inactivePkgs.map(async (pkgName) => {
        const isActive = await significantDownloads(mockPkg(pkgName));
        t.false(isActive, `${pkgName} has little or no downloads`);
    }));
});

test('hasReadme() looks for readmes of a reasonable length', (t) => {
    const fixture = (readme) => {
        const meta = { readme };
        return hasReadme(null, meta);
    };

    t.false(fixture(''));
    t.false(fixture());
    t.false(fixture(null));
    t.false(fixture(false));
    t.false(fixture(0));
    t.false(fixture('# some-pkg'));
    t.false(fixture(' A README consisting of ninety-nine characters, plus some bogus whitespace that will not be counted.   \n\n   \n\t'));

    t.true(fixture('# some pkg\n\n> Description of the project.\n\nUseful information about how to install and use some-pkg.'));
});

test('hasBinaryOrDependent() looks for a binary or dependent', async (t) => {
    const badPkgs = [
        {},
        { bin : '' },
        { bin : {} },
        { bin : { foo : '' } }
    ];
    await Promise.all(badPkgs.map(async (pkg) => {
        const err = await t.throwsAsync(hasBinaryOrDependent(pkg), TypeError);
        t.is(err.message, 'A package name is required.');
    }));

    const orphans = ['rawr', 'poo'];
    await Promise.all(orphans.map(async (pkgName) => {
        t.false(await hasBinaryOrDependent({ name : pkgName }));
    }));

    t.true(hasBinaryOrDependent({ bin : 'cli.js' }));
    t.true(hasBinaryOrDependent({ bin : { foo : 'cli.js' } }));
    t.true(hasBinaryOrDependent({
        name : 'rawr',
        bin  : 'cli.js'
    }));
});

test('hasProdVersion() looks for version 1.0.0 or greater', (t) => {
    t.false(hasProdVersion({}));
    t.false(hasProdVersion({ version : '0.0.0' }));
    t.false(hasProdVersion({ version : '0.0.1' }));
    t.false(hasProdVersion({ version : '0.1.0' }));
    t.false(hasProdVersion({ version : '1.0.0-0' }));

    t.true(hasProdVersion({ version : '1.0.0' }));
    t.true(hasProdVersion({ version : '1.0.1-0' }));
});

test('hasDependency() looks for a non-dev dependency', (t) => {
    t.false(hasDependency({}));
    t.false(hasDependency({ dependencies : {} }));
    t.false(hasDependency({ dependencies : { 'build-path' : '' } }));
    t.false(hasDependency({ devDependencies : { 'build-path' : '1.0.0' } }));

    t.true(hasDependency({ dependencies : { 'build-path' : '1.0.0' } }));
});

test('hasEngine() looks for an engine requirement', (t) => {
    t.false(hasEngine({}));
    t.false(hasEngine({ engines : {} }));
    t.false(hasEngine({ engines : { node : '' } }));

    t.true(hasEngine({ engines : { node : '1.0.0' } }));
    t.true(hasEngine({ engines : { npm : '1.0.0' } }));
});

test('hasFile() looks for a file whitelist', (t) => {
    t.false(hasFile({}));
    t.false(hasFile({ files : [] }));
    t.false(hasFile({ files : [''] }));

    t.true(hasFile({ files : ['index.js'] }));
});

test('hasTest() looks for a test script', (t) => {
    t.false(hasTest({}));
    t.false(hasTest({ scripts : {} }));
    t.false(hasTest({ scripts : { test : '' } }));
    // We do not count npm's default test script as valid.
    // eslint-disable-next-line no-useless-escape
    t.false(hasTest({ scripts : { test : 'echo \"Error: no test specified\" && exit 1' } }));
    t.false(hasTest({ scripts : { test : 'no test specified' } }));

    t.true(hasTest({ scripts : { test : 'xo' } }));
});

test('hasKeyword() looks for a file whitelist', (t) => {
    t.false(hasKeyword({}));
    t.false(hasKeyword({ keywords : [] }));
    t.false(hasKeyword({ keywords : [''] }));

    t.true(hasKeyword({ keywords : ['fun'] }));
});

test('hasExtraMaintainer() looks for multiple maintainers', (t) => {
    t.false(hasExtraMaintainer({}));
    t.false(hasExtraMaintainer({ maintainers : [] }));
    t.false(hasExtraMaintainer({ maintainers : [''] }));
    t.false(hasExtraMaintainer({ maintainers : [{}] }));
    t.false(hasExtraMaintainer({ maintainers : [{ name : '' }] }));
    t.false(hasExtraMaintainer({ maintainers : [{ name : 'Jane Doe' }] }));

    t.true(hasExtraMaintainer({
        maintainers : [
            { name : 'Jane Doe' },
            { name : 'John Doe' }
        ]
    }));
});
