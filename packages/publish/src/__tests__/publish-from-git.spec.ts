// FIXME: better mock for version command
jest.mock('../../../version/src/lib/git-push', () => jest.requireActual('../../../version/src/lib/__mocks__/git-push'));
jest.mock('../../../version/src/lib/is-anything-committed', () =>
  jest.requireActual('../../../version/src/lib/__mocks__/is-anything-committed')
);
jest.mock('../../../version/src/lib/is-behind-upstream', () =>
  jest.requireActual('../../../version/src/lib/__mocks__/is-behind-upstream')
);
jest.mock('../../../version/src/lib/remote-branch-exists', () =>
  jest.requireActual('../../../version/src/lib/__mocks__/remote-branch-exists')
);

// mocked modules of @lerna-lite/core
jest.mock('@lerna-lite/core', () => ({
  ...jest.requireActual('@lerna-lite/core'), // return the other real methods, below we'll mock only 2 of the methods
  Command: jest.requireActual('../../../core/src/command').Command,
  conf: jest.requireActual('../../../core/src/command').conf,
  pulseTillDone: jest.requireActual('../../../core/src/utils').pulseTillDone,
  collectUpdates: jest.requireActual('../../../core/src/__mocks__/collect-updates').collectUpdates,
  getOneTimePassword: () => Promise.resolve('654321'),
  logOutput: jest.requireActual('../../../core/src/__mocks__/output').logOutput,
  promptConfirmation: jest.requireActual('../../../core/src/__mocks__/prompt').promptConfirmation,
  throwIfUncommitted: jest.requireActual('../../../core/src/__mocks__/check-working-tree').throwIfUncommitted,
}));

// local modules _must_ be explicitly mocked
jest.mock('../lib/get-packages-without-license', () =>
  jest.requireActual('../lib/__mocks__/get-packages-without-license')
);
jest.mock('../lib/verify-npm-package-access', () => jest.requireActual('../lib/__mocks__/verify-npm-package-access'));
jest.mock('../lib/get-npm-username', () => jest.requireActual('../lib/__mocks__/get-npm-username'));
jest.mock('../lib/get-two-factor-auth-required', () =>
  jest.requireActual('../lib/__mocks__/get-two-factor-auth-required')
);
jest.mock('../lib/get-unpublished-packages', () => jest.requireActual('../lib/__mocks__/get-unpublished-packages'));
jest.mock('../lib/npm-publish', () => jest.requireActual('../lib/__mocks__/npm-publish'));

// mocked modules
import { npmPublish } from '../lib/npm-publish';
import { npmPublish as npmPublishMock } from '../lib/__mocks__/npm-publish';
import { logOutput, promptConfirmation, PublishCommandOption, throwIfUncommitted } from '@lerna-lite/core';

// helpers
import { gitTag } from '@lerna-test/helpers';
import { loggingOutput } from '@lerna-test/helpers/logging-output';
import { commandRunner, initFixtureFactory } from '@lerna-test/helpers';
const initFixture = initFixtureFactory(__dirname);

// test command
import yargParser from 'yargs-parser';
import { PublishCommand } from '../publish-command';
import cliCommands from '../../../cli/src/cli-commands/cli-publish-commands';
const lernaPublish = commandRunner(cliCommands);

const createArgv = (cwd, ...args) => {
  args.unshift('publish');
  if (args.length > 0 && args[1] && args[1].length > 0 && !args[1].startsWith('-')) {
    args[1] = `--bump=${args[1]}`;
  }
  const parserArgs = args.join(' ');
  const argv = yargParser(parserArgs);
  argv['$0'] = cwd;
  return argv as unknown as PublishCommandOption;
};

describe('publish from-git', () => {
  it('publishes tagged packages', async () => {
    const cwd = await initFixture('normal');

    await gitTag(cwd, 'v1.0.0');
    await new PublishCommand(createArgv(cwd, '--bump', 'from-git'));

    // called from chained describeRef()
    expect(throwIfUncommitted).toHaveBeenCalled();

    expect(promptConfirmation).toHaveBeenLastCalledWith('Are you sure you want to publish these packages?');
    expect((logOutput as any).logged()).toMatch('Found 4 packages to publish:');
    expect((npmPublish as typeof npmPublishMock).order()).toEqual([
      'package-1',
      'package-4',
      'package-2',
      'package-3',
      // package-5 is private
    ]);
  });

  it('publishes tagged packages that includes workspace in the name prefix', async () => {
    const cwd = await initFixture('normal-workspace-name-prefixed');

    await gitTag(cwd, 'v1.0.0');
    await new PublishCommand(createArgv(cwd, '--bump', 'from-git', '--cleanup-temp-files'));

    // called from chained describeRef()
    expect(throwIfUncommitted).toHaveBeenCalled();

    expect(promptConfirmation).toHaveBeenLastCalledWith('Are you sure you want to publish these packages?');
    expect((logOutput as any).logged()).toMatch('Found 4 packages to publish:');
    expect((npmPublish as typeof npmPublishMock).order()).toEqual([
      '@my-workspace/package-1',
      '@my-workspace/package-4',
      '@my-workspace/package-2',
      '@my-workspace/package-3',
      // @my-workspace/package-5 is private
    ]);

    // check that @my-workspace/package-1 is properly escaped in the tarball tgz name
    expect(npmPublish).toHaveBeenCalledWith(
      expect.objectContaining({ name: '@my-workspace/package-1', version: '1.0.0' }),
      expect.stringContaining('my-workspace-package-1-1.0.0.tgz'),
      expect.any(Object),
      expect.any(Object)
    );
  });

  it('publishes tagged packages in dry-run mode', async () => {
    const cwd = await initFixture('normal');

    await gitTag(cwd, 'v1.0.0');
    await new PublishCommand(createArgv(cwd, '--bump', 'from-git', '--dry-run'));

    // called from chained describeRef()
    expect(throwIfUncommitted).toHaveBeenCalled();

    expect(promptConfirmation).toHaveBeenLastCalledWith('[dry-run] Are you sure you want to publish these packages?');
    expect((logOutput as any).logged()).toMatch('Found 4 packages to publish:');
    expect((npmPublish as typeof npmPublishMock).order()).toEqual([
      'package-1',
      'package-4',
      'package-2',
      'package-3',
      // package-5 is private
    ]);
  });

  it('publishes tagged packages, lexically sorted when --no-sort is present', async () => {
    const cwd = await initFixture('normal');

    await gitTag(cwd, 'v1.0.0');
    await new PublishCommand(createArgv(cwd, 'from-git', '--no-sort'));

    // called from chained describeRef()
    expect(throwIfUncommitted).toHaveBeenCalled();

    expect(promptConfirmation).toHaveBeenLastCalledWith('Are you sure you want to publish these packages?');
    expect((logOutput as any).logged()).toMatch('Found 4 packages to publish:');
    expect((npmPublish as typeof npmPublishMock).order()).toEqual([
      'package-1',
      'package-2',
      'package-3',
      'package-4',
      // package-5 is private
    ]);
  });

  it('publishes tagged independent packages', async () => {
    const cwd = await initFixture('independent');

    await Promise.all([
      gitTag(cwd, 'package-1@1.0.0'),
      gitTag(cwd, 'package-2@2.0.0'),
      gitTag(cwd, 'package-3@3.0.0'),
      gitTag(cwd, 'package-4@4.0.0'),
      gitTag(cwd, 'package-5@5.0.0'),
    ]);
    await new PublishCommand(createArgv(cwd, '--bump', 'from-git'));

    expect((npmPublish as typeof npmPublishMock).order()).toEqual([
      'package-1',
      'package-4',
      'package-2',
      'package-3',
      // package-5 is private
    ]);
  });

  it('publishes packages matching custom --tag-version-prefix', async () => {
    const cwd = await initFixture('normal');

    await gitTag(cwd, 'foo/1.0.0');
    await new PublishCommand(createArgv(cwd, '--bump', 'from-git', '--tag-version-prefix', 'foo/'));

    expect((npmPublish as typeof npmPublishMock).order()).toEqual([
      'package-1',
      'package-4',
      'package-2',
      'package-3',
      // package-5 is private
    ]);
  });

  it('only publishes independent packages with matching tags', async () => {
    const cwd = await initFixture('independent');

    await gitTag(cwd, 'package-3@3.0.0');
    await new PublishCommand(createArgv(cwd, '--bump', 'from-git'));

    expect((logOutput as any).logged()).toMatch('Found 1 package to publish:');
    expect((npmPublish as typeof npmPublishMock).order()).toEqual(['package-3']);
  });

  it('exits early when the current commit is not tagged', async () => {
    const cwd = await initFixture('normal');

    await new PublishCommand(createArgv(cwd, '--bump', 'from-git'));

    expect(npmPublish).not.toHaveBeenCalled();

    const logMessages = loggingOutput('info');
    expect(logMessages).toContain('No tagged release found. You might not have fetched tags.');
  });

  it('throws an error when uncommitted changes are present', async () => {
    (throwIfUncommitted as jest.Mock).mockImplementationOnce(() => {
      throw new Error('uncommitted');
    });

    const cwd = await initFixture('normal');
    const command = new PublishCommand(createArgv(cwd, '--bump', 'from-git'));

    await expect(command).rejects.toThrow('uncommitted');
    // notably different than the actual message, but good enough here
  });

  it('throws an error when --git-head is passed', async () => {
    const cwd = await initFixture('normal');
    const command = new PublishCommand(createArgv(cwd, '--bump', 'from-git', '--git-head', 'deadbeef'));

    await expect(command).rejects.toThrow(
      expect.objectContaining({
        prefix: 'EGITHEAD',
      })
    );
  });

  it('should throw even when npm publish throws any other type of errors from a previous half publish process', async () => {
    (npmPublish as jest.Mock).mockImplementationOnce(() => {
      return Promise.reject({ code: 'UNAUTHORIZED' });
    });

    const cwd = await initFixture('normal');

    await gitTag(cwd, 'v1.0.0');
    const command = new PublishCommand(createArgv(cwd, 'from-git', '--no-sort'));

    await expect(command).rejects.toEqual({ code: 'UNAUTHORIZED', name: 'ValidationError' });
    expect(process.exitCode).toBe(1);
  });

  it('should not throw and assume package is already published when npm publish throws EPUBLISHCONFLICT from a previous half publish process', async () => {
    (npmPublish as jest.Mock).mockImplementation(() => {
      return Promise.reject({ code: 'EPUBLISHCONFLICT' });
    });

    const cwd = await initFixture('normal');

    await gitTag(cwd, 'v1.0.0');
    const command = new PublishCommand(createArgv(cwd, 'from-git', '--no-sort'));

    await expect(command).resolves.toBeUndefined();

    // called from chained describeRef()
    expect(throwIfUncommitted).toHaveBeenCalled();

    // since all packages rejected with publish conflict, we should have the "All published" message when recalling execute()
    command.initialize();
    const loggerSpy = jest.spyOn(command.logger, 'success');
    await command.execute();
    expect(loggerSpy).toHaveBeenCalledWith('All packages have already been published.');
  });
});
