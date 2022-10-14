// FIXME: better mock for version command
jest.mock('../../../version/dist/lib/git-push', () =>
  jest.requireActual('../../../version/src/lib/__mocks__/git-push')
);
jest.mock('../../../version/dist/lib/is-anything-committed', () =>
  jest.requireActual('../../../version/src/lib/__mocks__/is-anything-committed')
);
jest.mock('../../../version/dist/lib/is-behind-upstream', () =>
  jest.requireActual('../../../version/src/lib/__mocks__/is-behind-upstream')
);
jest.mock('../../../version/dist/lib/remote-branch-exists', () =>
  jest.requireActual('../../../version/src/lib/__mocks__/remote-branch-exists')
);

// mocked modules of @lerna-lite/core
jest.mock('@lerna-lite/core', () => ({
  ...jest.requireActual('@lerna-lite/core'), // return the other real methods, below we'll mock only 2 of the methods
  Command: jest.requireActual('../../../core/src/command').Command,
  conf: jest.requireActual('../../../core/src/command').conf,
  collectUpdates: jest.requireActual('../../../core/src/__mocks__/collect-updates').collectUpdates,
  getOneTimePassword: () => Promise.resolve('654321'),
  logOutput: jest.requireActual('../../../core/src/__mocks__/output').logOutput,
  createRunner: jest.requireActual('../../../core/src/__mocks__/run-lifecycle').createRunner,
  runLifecycle: jest.requireActual('../../../core/src/__mocks__/run-lifecycle').runLifecycle,
  promptConfirmation: jest.requireActual('../../../core/src/__mocks__/prompt').promptConfirmation,
  promptSelectOne: jest.requireActual('../../../core/src/__mocks__/prompt').promptSelectOne,
  promptTextInput: jest.requireActual('../../../core/src/__mocks__/prompt').promptTextInput,
  throwIfUncommitted: jest.requireActual('../../../core/src/__mocks__/check-working-tree').throwIfUncommitted,
}));

// also point to the local publish command so that all mocks are properly used even by the command-runner
jest.mock('@lerna-lite/publish', () => jest.requireActual('../publish-command'));

// local modules _must_ be explicitly mocked
jest.mock('../lib/get-packages-without-license', () =>
  jest.requireActual('../lib/__mocks__/get-packages-without-license')
);
jest.mock('../lib/verify-npm-package-access', () => jest.requireActual('../lib/__mocks__/verify-npm-package-access'));
jest.mock('../lib/get-npm-username', () => jest.requireActual('../lib/__mocks__/get-npm-username'));
jest.mock('../lib/get-two-factor-auth-required', () =>
  jest.requireActual('../lib/__mocks__/get-two-factor-auth-required')
);
jest.mock('../lib/pack-directory', () => jest.requireActual('../lib/__mocks__/pack-directory'));
jest.mock('../lib/npm-publish', () => jest.requireActual('../lib/__mocks__/npm-publish'));
jest.mock('load-json-file', () => jest.requireActual('../../../version/src/lib/__mocks__/load-json-file'));

// mocked modules
import loadJsonFile from 'load-json-file';
import { packDirectory } from '../lib/pack-directory';
import { runLifecycle } from '@lerna-lite/core';

// helpers
import { loggingOutput } from '@lerna-test/helpers/logging-output';
import { commandRunner, initFixtureFactory } from '@lerna-test/helpers';
const initFixture = initFixtureFactory(__dirname);
import path from 'path';

// test command
import cliCommands from '../../../cli/src/cli-commands/cli-publish-commands';
const lernaPublish = commandRunner(cliCommands);

describe('lifecycle scripts', () => {
  const npmLifecycleEvent = process.env.npm_lifecycle_event;

  afterEach(() => {
    process.env.npm_lifecycle_event = npmLifecycleEvent;
  });

  it('calls publish lifecycle scripts for root and packages', async () => {
    const cwd = await initFixture('lifecycle');

    await lernaPublish(cwd)();

    ['prepare', 'prepublishOnly', 'prepack', 'postpack', 'postpublish'].forEach((script) => {
      // "lifecycle" is the root manifest name
      expect(runLifecycle).toHaveBeenCalledWith(
        expect.objectContaining({ name: 'lifecycle' }),
        script,
        expect.any(Object)
      );
    });

    // package-2 only has prepublish lifecycle
    expect(packDirectory).toHaveBeenCalledWith(
      expect.objectContaining({ name: 'package-2' }),
      path.join(cwd, 'packages/package-2'),
      expect.objectContaining({
        'ignore-prepublish': false,
        'ignore-scripts': false,
      })
    );

    expect((runLifecycle as any).getOrderedCalls()).toEqual([
      // TODO: separate from VersionCommand details
      ['lifecycle', 'preversion'],
      ['package-1', 'preversion'],
      ['package-1', 'version'],
      ['lifecycle', 'version'],
      ['package-1', 'postversion'],
      ['lifecycle', 'postversion'],
      // publish-specific
      ['lifecycle', 'prepublish'],
      ['lifecycle', 'prepare'],
      ['lifecycle', 'prepublishOnly'],
      ['lifecycle', 'prepack'],
      ['lifecycle', 'postpack'],
      ['lifecycle', 'postpublish'],
    ]);

    expect(Array.from((loadJsonFile as any).registry.keys())).toStrictEqual([
      '/packages/package-1',
      '/packages/package-2',
      '/',
    ]);
  });

  it('does not execute recursive root scripts', async () => {
    const cwd = await initFixture('lifecycle');

    process.env.npm_lifecycle_event = 'prepublish';

    await lernaPublish(cwd)();

    expect((runLifecycle as any).getOrderedCalls()).toEqual([
      // TODO: separate from VersionCommand details
      ['lifecycle', 'preversion'],
      ['package-1', 'preversion'],
      ['package-1', 'version'],
      ['lifecycle', 'version'],
      ['package-1', 'postversion'],
      ['lifecycle', 'postversion'],
      // publish-specific
      ['lifecycle', 'prepare'],
      ['lifecycle', 'prepublishOnly'],
      ['lifecycle', 'prepack'],
      ['lifecycle', 'postpack'],
    ]);
  });

  it('does not duplicate rooted leaf scripts', async () => {
    const cwd = await initFixture('lifecycle-rooted-leaf');

    await lernaPublish(cwd)();

    expect((runLifecycle as any).getOrderedCalls()).toEqual([
      // TODO: separate from VersionCommand details
      ['package-1', 'preversion'],
      ['package-1', 'version'],
      ['lifecycle-rooted-leaf', 'preversion'],
      ['lifecycle-rooted-leaf', 'version'],
      ['lifecycle-rooted-leaf', 'postversion'],
      ['package-1', 'postversion'],
      // NO publish-specific root lifecycles should be duplicated
      // (they are all run by pack-directory and npm-publish)
    ]);
  });

  it('respects --ignore-prepublish', async () => {
    const cwd = await initFixture('lifecycle');

    await lernaPublish(cwd)('--ignore-prepublish');

    expect(packDirectory).toHaveBeenCalledWith(
      expect.objectContaining({ name: 'package-2' }),
      path.join(cwd, 'packages/package-2'),
      expect.objectContaining({
        'ignore-prepublish': true,
      })
    );

    // runLifecycle() is _called_ with "prepublish" for root,
    // but it does not actually execute, and is tested elsewhere
  });

  it('respects --ignore-scripts', async () => {
    const cwd = await initFixture('lifecycle');

    await lernaPublish(cwd)('--ignore-scripts');

    // despite all the scripts being passed to runLifecycle() (and implicitly, packDirectory()),
    // none of them will actually execute as long as opts["ignore-scripts"] is provided
    expect(runLifecycle).toHaveBeenCalledWith(
      expect.objectContaining({ name: 'lifecycle' }),
      'prepare',
      expect.objectContaining({
        'ignore-scripts': true,
      })
    );
    expect(packDirectory).toHaveBeenCalledWith(
      expect.objectContaining({ name: 'package-2' }),
      path.join(cwd, 'packages/package-2'),
      expect.objectContaining({
        'ignore-scripts': true,
      })
    );
  });
});

describe('execScript', () => {
  it('execute --require-scripts but fails since scripts folder does not exist and log error with script not found message is shown', async () => {
    const cwd = await initFixture('lifecycle');

    await lernaPublish(cwd)('--require-scripts');
    const logInfoMessages = loggingOutput('info');
    const logSillyMessages = loggingOutput('silly');

    expect(logInfoMessages).toContain('enabled');
    expect(logSillyMessages.filter((x) => x.includes('No prepublish script found at'))).toBeTruthy();
    expect(logSillyMessages.filter((x) => x.includes('No postpublish script found at'))).toBeTruthy();
  });
});
