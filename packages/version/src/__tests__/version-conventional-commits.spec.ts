// local modules _must_ be explicitly mocked
jest.mock('../lib/git-push', () => jest.requireActual('../lib/__mocks__/git-push'));
jest.mock('../lib/is-anything-committed', () => jest.requireActual('../lib/__mocks__/is-anything-committed'));
jest.mock('../lib/is-behind-upstream', () => jest.requireActual('../lib/__mocks__/is-behind-upstream'));
jest.mock('../lib/remote-branch-exists', () => jest.requireActual('../lib/__mocks__/remote-branch-exists'));

jest.mock('@lerna-lite/core', () => ({
  ...(jest.requireActual('@lerna-lite/core') as any), // return the other real methods, below we'll mock only 2 of the methods
  Command: jest.requireActual('../../../core/src/command').Command,
  conf: jest.requireActual('../../../core/src/command').conf,
  createGitHubClient: jest.requireActual('../../../core/src/__mocks__/github-client').createGitHubClient,
  createGitLabClient: jest.requireActual('../../../core/src/__mocks__/gitlab-client').createGitLabClient,
  parseGitRepo: jest.requireActual('../../../core/src/__mocks__/github-client').parseGitRepo,
  recommendVersion: jest.requireActual('../../../core/src/__mocks__/conventional-commits').recommendVersion,
  updateChangelog: jest.requireActual('../../../core/src/__mocks__/conventional-commits').updateChangelog,
  logOutput: jest.requireActual('../../../core/src/__mocks__/output').logOutput,
  collectUpdates: jest.requireActual('../../../core/src/__mocks__/collect-updates').collectUpdates,
  promptConfirmation: jest.requireActual('../../../core/src/__mocks__/prompt').promptConfirmation,
  promptSelectOne: jest.requireActual('../../../core/src/__mocks__/prompt').promptSelectOne,
  promptTextInput: jest.requireActual('../../../core/src/__mocks__/prompt').promptTextInput,
  checkWorkingTree: jest.requireActual('../../../core/src/__mocks__/check-working-tree').checkWorkingTree,
  throwIfReleased: jest.requireActual('../../../core/src/__mocks__/check-working-tree').throwIfReleased,
  throwIfUncommitted: jest.requireActual('../../../core/src/__mocks__/check-working-tree').throwIfUncommitted,
}));

import path from 'path';
import semver from 'semver';

// mocked modules
import writePkg from 'write-pkg';
import { collectUpdates, VersionCommandOption } from '@lerna-lite/core';
import { recommendVersion, updateChangelog } from '@lerna-lite/core';

// helpers
import { initFixtureFactory, showCommit } from '@lerna-test/helpers';
const initFixture = initFixtureFactory(path.resolve(__dirname, '../../../publish/src/__tests__'));

// test command
import { VersionCommand } from '../version-command';
import yargParser from 'yargs-parser';

const createArgv = (cwd, ...args) => {
  args.unshift('version');
  if (args.length > 0 && args[1]?.length > 0 && !args[1].startsWith('-')) {
    args[1] = `--bump=${args[1]}`;
  }
  const parserArgs = args.map(String);
  const argv = yargParser(parserArgs);
  argv['$0'] = cwd;
  return argv as unknown as VersionCommandOption;
};

describe('--conventional-commits', () => {
  describe('independent', () => {
    const versionBumps = new Map([
      ['package-1', '1.0.1'],
      ['package-2', '2.1.0'],
      ['package-3', '4.0.0'],
      ['package-4', '4.1.0'],
      ['package-5', '5.0.1'],
    ]);

    const prereleaseVersionBumps = new Map([
      ['package-1', '1.0.1-alpha.0'],
      ['package-2', '2.1.0-alpha.0'],
      ['package-3', '4.0.0-beta.0'],
      ['package-4', '4.1.0-alpha.0'],
      ['package-5', '5.0.1-alpha.0'],
    ]);

    it('should use conventional-commits utility to guess version bump and generate CHANGELOG', async () => {
      versionBumps.forEach((bump) => (recommendVersion as jest.Mock).mockResolvedValueOnce(bump));

      const cwd = await initFixture('independent');

      await new VersionCommand(createArgv(cwd, '--conventional-commits'));

      const changedFiles = await showCommit(cwd, '--name-only');
      expect(changedFiles).toMatchSnapshot();

      versionBumps.forEach((version, name) => {
        expect(recommendVersion).toHaveBeenCalledWith(expect.objectContaining({ name }), 'independent', {
          changelogPreset: undefined,
          rootPath: cwd,
          tagPrefix: 'v',
          prereleaseId: undefined,
        });
        expect(updateChangelog).toHaveBeenCalledWith(expect.objectContaining({ name, version }), 'independent', {
          changelogPreset: undefined,
          rootPath: cwd,
          tagPrefix: 'v',
          prereleaseId: undefined,
        });
      });
    });

    it('should guess prerelease version bumps and generate CHANGELOG', async () => {
      prereleaseVersionBumps.forEach((bump) => (recommendVersion as jest.Mock).mockResolvedValueOnce(bump));
      const cwd = await initFixture('prerelease-independent');

      await new VersionCommand(createArgv(cwd, '--conventional-commits', '--conventional-prerelease'));

      const changedFiles = await showCommit(cwd, '--name-only');
      expect(changedFiles).toMatchSnapshot();

      prereleaseVersionBumps.forEach((version, name) => {
        const prereleaseId = (semver as any).prerelease(version)[0];
        expect(recommendVersion).toHaveBeenCalledWith(expect.objectContaining({ name }), 'independent', {
          changelogPreset: undefined,
          rootPath: cwd,
          tagPrefix: 'v',
          prereleaseId,
        });
        expect(updateChangelog).toHaveBeenCalledWith(expect.objectContaining({ name, version }), 'independent', {
          changelogPreset: undefined,
          rootPath: cwd,
          tagPrefix: 'v',
        });
      });
    });

    it('should graduate prerelease version bumps and generate CHANGELOG', async () => {
      versionBumps.forEach((bump) => (recommendVersion as jest.Mock).mockResolvedValueOnce(bump));
      const cwd = await initFixture('prerelease-independent');

      await new VersionCommand(createArgv(cwd, '--conventional-commits', '--conventional-graduate'));

      const changedFiles = await showCommit(cwd, '--name-only');
      expect(changedFiles).toMatchSnapshot();

      versionBumps.forEach((version, name) => {
        expect(recommendVersion).toHaveBeenCalledWith(expect.objectContaining({ name }), 'independent', {
          changelogPreset: undefined,
          rootPath: cwd,
          tagPrefix: 'v',
          prerelease: undefined,
        });
        expect(updateChangelog).toHaveBeenCalledWith(expect.objectContaining({ name, version }), 'independent', {
          changelogPreset: undefined,
          rootPath: cwd,
          tagPrefix: 'v',
        });
      });
    });

    it('accepts --changelog-preset option', async () => {
      const cwd = await initFixture('independent');
      const changelogOpts = {
        changelogPreset: 'foo-bar',
        rootPath: cwd,
        tagPrefix: 'v',
        prereleaseId: undefined,
      };

      await new VersionCommand(createArgv(cwd, '--conventional-commits', '--changelog-preset', 'foo-bar'));

      expect(recommendVersion).toHaveBeenCalledWith(expect.any(Object), 'independent', changelogOpts);
      expect(updateChangelog).toHaveBeenCalledWith(expect.any(Object), 'independent', changelogOpts);
    });

    it('should not update changelogs with --no-changelog option', async () => {
      const cwd = await initFixture('independent');
      await new VersionCommand(createArgv(cwd, '--conventional-commits', '--no-changelog'));

      expect(updateChangelog).not.toHaveBeenCalled();
    });

    it('should respect --no-private', async () => {
      const cwd = await initFixture('independent');
      // TODO: (major) make --no-private the default
      await new VersionCommand(createArgv(cwd, '--conventional-commits', '--no-private'));

      const changedFiles = await showCommit(cwd, '--name-only');
      expect(changedFiles).not.toContain('package-5');
    });
  });

  describe('fixed mode', () => {
    it('should use conventional-commits utility to guess version bump and generate CHANGELOG', async () => {
      (recommendVersion as any)
        .mockResolvedValueOnce('1.0.1')
        .mockResolvedValueOnce('1.1.0')
        .mockResolvedValueOnce('2.0.0')
        .mockResolvedValueOnce('1.1.0')
        .mockResolvedValueOnce('1.0.0');

      const cwd = await initFixture('normal');

      await new VersionCommand(createArgv(cwd, '--conventional-commits'));

      const changedFiles = await showCommit(cwd, '--name-only');
      expect(changedFiles).toMatchSnapshot();

      ['package-1', 'package-2', 'package-3', 'package-4', 'package-5'].forEach((name) => {
        const location = path.join(cwd, 'packages', name);

        expect(recommendVersion).toHaveBeenCalledWith(expect.objectContaining({ name, location }), 'fixed', {
          changelogPreset: undefined,
          rootPath: cwd,
          tagPrefix: 'v',
          prereleaseId: undefined,
        });

        expect(updateChangelog).toHaveBeenCalledWith(expect.objectContaining({ name, version: '2.0.0' }), 'fixed', {
          changelogPreset: undefined,
          rootPath: cwd,
          tagPrefix: 'v',
          prereleaseId: undefined,
        });
      });

      expect(updateChangelog).toHaveBeenLastCalledWith(
        expect.objectContaining({
          name: 'normal',
          location: cwd,
        }),
        'root',
        {
          changelogPreset: undefined,
          rootPath: cwd,
          tagPrefix: 'v',
          version: '2.0.0',
          prereleaseId: undefined,
        }
      );
    });

    it('should guess prerelease version bumps and generate CHANGELOG', async () => {
      (recommendVersion as any)
        .mockResolvedValueOnce('1.0.1-alpha.0')
        .mockResolvedValueOnce('1.1.0-alpha.0')
        .mockResolvedValueOnce('2.0.0-alpha.0')
        .mockResolvedValueOnce('1.1.0-alpha.0')
        .mockResolvedValueOnce('1.0.0-alpha.0');

      const cwd = await initFixture('normal');

      await new VersionCommand(createArgv(cwd, '--conventional-commits', '--conventional-prerelease'));

      const changedFiles = await showCommit(cwd, '--name-only');
      expect(changedFiles).toMatchSnapshot();

      ['package-1', 'package-2', 'package-3', 'package-4', 'package-5'].forEach((name) => {
        const location = path.join(cwd, 'packages', name);

        expect(recommendVersion).toHaveBeenCalledWith(expect.objectContaining({ name, location }), 'fixed', {
          changelogPreset: undefined,
          rootPath: cwd,
          tagPrefix: 'v',
          prereleaseId: 'alpha',
        });

        expect(updateChangelog).toHaveBeenCalledWith(
          expect.objectContaining({ name, version: '2.0.0-alpha.0' }),
          'fixed',
          { changelogPreset: undefined, rootPath: cwd, tagPrefix: 'v' }
        );
      });

      expect(updateChangelog).toHaveBeenLastCalledWith(
        expect.objectContaining({
          name: 'normal',
          location: cwd,
        }),
        'root',
        {
          changelogPreset: undefined,
          rootPath: cwd,
          tagPrefix: 'v',
          version: '2.0.0-alpha.0',
          prereleaseId: undefined,
        }
      );
    });

    it('accepts --changelog-preset option', async () => {
      const cwd = await initFixture('normal');
      const changelogOpts = {
        changelogPreset: 'baz-qux',
        rootPath: cwd,
        tagPrefix: 'dragons-are-awesome',
        prereleaseId: undefined,
      };

      await new VersionCommand(
        createArgv(
          cwd,
          '--conventional-commits',
          '--changelog-preset',
          'baz-qux',
          '--tag-version-prefix',
          'dragons-are-awesome'
        )
      );

      expect(recommendVersion).toHaveBeenCalledWith(expect.any(Object), 'fixed', changelogOpts);
      expect(updateChangelog).toHaveBeenCalledWith(expect.any(Object), 'fixed', changelogOpts);
    });

    it('should not update changelogs with --no-changelog option', async () => {
      const cwd = await initFixture('normal');
      await new VersionCommand(createArgv(cwd, '--conventional-commits', '--no-changelog'));

      expect(updateChangelog).not.toHaveBeenCalled();
    });

    it('should respect --no-private', async () => {
      const cwd = await initFixture('normal');
      // TODO: (major) make --no-private the default
      await new VersionCommand(createArgv(cwd, '--conventional-commits', '--no-private'));

      const changedFiles = await showCommit(cwd, '--name-only');
      expect(changedFiles).not.toContain('package-5');
    });
  });

  it('avoids duplicating previously-released version', async () => {
    const cwd = await initFixture('no-interdependencies');

    (collectUpdates as any).setUpdated(cwd, 'package-1');
    (recommendVersion as jest.Mock).mockResolvedValueOnce('1.1.0');

    await new VersionCommand(createArgv(cwd, '--conventional-commits'));

    expect((writePkg as any).updatedVersions()).toEqual({
      'package-1': '1.1.0',
    });

    // clear previous publish mock records
    jest.clearAllMocks();
    (writePkg as any).registry.clear();

    (collectUpdates as any).setUpdated(cwd, 'package-2');
    (recommendVersion as jest.Mock).mockImplementationOnce((pkg) =>
      Promise.resolve((semver as any).inc(pkg.version, 'patch'))
    );

    await new VersionCommand(createArgv(cwd, '--conventional-commits'));

    expect((writePkg as any).updatedVersions()).toEqual({
      'package-2': '1.1.1',
    });
  });
});
