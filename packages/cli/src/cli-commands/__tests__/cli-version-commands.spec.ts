import { describe, expect, it, vi } from 'vitest';

vi.mock('@lerna-lite/version', () => null);
import cliVersion from '../cli-version-commands';
import yargs from 'yargs/yargs';

const oc = expect.objectContaining;

describe('Version Command CLI options', () => {
  it('should log a console error when versionCommand is not provided', async () => {
    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

    await cliVersion.handler(undefined as any);

    expect(consoleSpy).toHaveBeenCalledWith(expect.stringContaining('"@lerna-lite/version" is optional and was not found.'), expect.anything());
  });

  it.each`
    args                                                                                   | expected
    ${'version minor'}                                                                     | ${{ bump: 'minor' }}
    ${'version prepatch'}                                                                  | ${{ bump: 'prepatch' }}
    ${'version --dry-run'}                                                                 | ${{ 'dry-run': true, dryRun: true }}
    ${'version --dry-run major'}                                                           | ${{ 'dry-run': true, dryRun: true, bump: 'major' }}
    ${'version --conventional-commits --yes --conventional-prerelease --dry-run premajor'} | ${oc({ dryRun: true, bump: 'premajor', conventionalPrerelease: true })}
    ${'version --dry-run true'}                                                            | ${{ dryRun: true, 'dry-run': true }}
    ${'version --conventional-commits --yes --conventional-prerelease 0.2'}                | ${oc({ conventionalCommits: true, conventionalPrerelease: 0.2 })}
    ${'version --conventional-commits --yes --conventional-prerelease=* premajor'}         | ${oc({ bump: 'premajor', conventionalCommits: true, conventionalPrerelease: '*' })}
  `('should parse args as expected: "$args"', async ({ args, expected }) => {
    const argv: string[] = typeof args === 'string' ? args.split(/\s+/g) : args;
    const {
      $0: _caller,
      _,
      ...options
    } = await yargs()
      .command(cliVersion as any)
      .exitProcess(false)
      .parse(argv);
    // console.log('%o', options);
    expect(options).toEqual(expected);
  });
});
