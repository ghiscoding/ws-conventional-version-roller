// local modules _must_ be explicitly mocked
jest.mock('../lib/git-push', () => jest.requireActual('../lib/__mocks__/git-push'));
jest.mock('../lib/is-anything-committed', () => jest.requireActual('../lib/__mocks__/is-anything-committed'));
jest.mock('../lib/is-behind-upstream', () => jest.requireActual('../lib/__mocks__/is-behind-upstream'));
jest.mock('../lib/remote-branch-exists', () => jest.requireActual('../lib/__mocks__/remote-branch-exists'));

jest.mock('@lerna-lite/core', () => ({
  ...(jest.requireActual('@lerna-lite/core') as any), // return the other real methods, below we'll mock only 2 of the methods
  logOutput: jest.requireActual('../../../core/src/__mocks__/output').logOutput,
  promptConfirmation: jest.requireActual('../../../core/src/__mocks__/prompt').promptConfirmation,
  promptSelectOne: jest.requireActual('../../../core/src/__mocks__/prompt').promptSelectOne,
  promptTextInput: jest.requireActual('../../../core/src/__mocks__/prompt').promptTextInput,
  throwIfUncommitted: jest.requireActual('../../../core/src/__mocks__/check-working-tree').throwIfUncommitted,
}));

import path from 'path';
import yargParser from 'yargs-parser';

// helpers
import { getCommitMessage, initFixtureFactory } from '@lerna-test/helpers';
const initFixture = initFixtureFactory(path.resolve(__dirname, '../../../publish/src/__tests__'));

// test command
import { VersionCommand } from '../version-command';

// stabilize commit SHA
import gitSHA from '@lerna-test/helpers/serializers/serialize-git-sha';
import { VersionCommandOption } from '@lerna-lite/core';
expect.addSnapshotSerializer(gitSHA);

const createArgv = (cwd: string, ...args: string[]) => {
  args.unshift('version');
  if (args.length > 0 && args[1]?.length > 0 && !args[1].startsWith('-')) {
    args[1] = `--bump=${args[1]}`;
  }
  const parserArgs = args.map(String);
  const argv = yargParser(parserArgs);
  argv['$0'] = cwd;
  return argv as unknown as VersionCommandOption;
};

test('publish --message %s', async () => {
  const cwd = await initFixture('normal');
  // await lernaVersion(cwd)("--message", "chore: Release %s :rocket:");
  await new VersionCommand(createArgv(cwd, '--message', 'chore: Release %s :rocket:'));

  const message = await getCommitMessage(cwd);
  expect(message).toMatch('chore: Release v1.0.1 :rocket:');
});

test('publish --message %v', async () => {
  const cwd = await initFixture('normal');
  // await lernaVersion(cwd)("--message", "chore: Version %v without prefix");
  await new VersionCommand(createArgv(cwd, '--message', 'chore: Version %v without prefix'));

  const message = await getCommitMessage(cwd);
  expect(message).toMatch('chore: Version 1.0.1 without prefix');
});

test('publish -m --independent', async () => {
  const cwd = await initFixture('independent');
  // await lernaVersion(cwd)("-m", "chore: Custom publish message subject");
  await new VersionCommand(createArgv(cwd, '--message', 'chore: Custom publish message subject'));

  const message = await getCommitMessage(cwd);
  expect(message).toMatch('chore: Custom publish message subject');
});
