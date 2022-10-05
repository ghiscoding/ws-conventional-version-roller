import chalk from 'chalk';
import log from 'npmlog';
import newGithubReleaseUrl from 'new-github-release-url';
import semver from 'semver';

import {
  createGitHubClient,
  createGitLabClient,
  GitCreateReleaseClientOutput,
  parseGitRepo,
  ReleaseClient,
  ReleaseCommandProps,
  ReleaseOptions,
  ValidationError,
} from '@lerna-lite/core';

export function createReleaseClient(type: 'github' | 'gitlab'): GitCreateReleaseClientOutput {
  switch (type) {
    case 'gitlab':
      return createGitLabClient();
    case 'github':
      return createGitHubClient();
    /* istanbul ignore next: guarded by yargs.choices() */
    default:
      throw new ValidationError('ERELEASE', 'Invalid release client type');
  }
}

/**
 * @param {ReturnType<typeof createReleaseClient>} client
 * @param {{ tags: string[]; releaseNotes: { name: string; notes: string; }[] }} commandProps
 * @param {{ gitRemote: string; execOpts: import('@lerna/child-process').ExecOpts }} opts
 */
export function createRelease(
  client: ReleaseClient,
  { tags, releaseNotes }: ReleaseCommandProps,
  { gitRemote, execOpts }: ReleaseOptions,
  gitDryRun = false
) {
  const { GH_TOKEN } = process.env;
  const repo = parseGitRepo(gitRemote, execOpts);

  return Promise.all(
    releaseNotes.map(({ notes, name }) => {
      const tag = name === 'fixed' ? tags[0] : tags.find((t) => t.startsWith(`${name}@`));

      /* istanbul ignore if */
      if (!tag) {
        return Promise.resolve();
      }

      const prereleaseParts = semver.prerelease(tag.replace(`${name}@`, '')) || [];

      // when the `GH_TOKEN` environment variable is not set,
      // we'll create a link to GitHub web interface form with the fields pre-populated
      if (!GH_TOKEN) {
        const releaseUrl = newGithubReleaseUrl({
          user: repo.owner,
          repo: repo.name,
          tag,
          isPrerelease: prereleaseParts.length > 0,
          title: tag,
          body: notes,
        });
        log.verbose('github', 'GH_TOKEN environment variable is not set');
        log.info('github', `🔗 ${releaseUrl} 🏷️ (GitHub Release web interface)`);
        return Promise.resolve();
      }

      const releaseOptions = {
        owner: repo.owner,
        repo: repo.name,
        tag_name: tag,
        name: tag,
        body: notes,
        draft: false,
        prerelease: prereleaseParts.length > 0,
      };

      if (gitDryRun) {
        log.info(
          chalk.bold.magenta('[dry-run] >'),
          `Create Release with repo options: `,
          JSON.stringify(releaseOptions)
        );
        return Promise.resolve();
      }

      return client.repos.createRelease(releaseOptions);
    })
  );
}
