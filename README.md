# Lerna-Lite <img src="https://avatars.githubusercontent.com/u/120162016?s=96&amp;v=4" alt="@lerna-lite" size="55" height="55" width="55" data-view-component="true" style="margin-bottom:-10px">

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![TypeScript](https://img.shields.io/badge/%3C%2F%3E-TypeScript-%230074c1.svg)](http://www.typescriptlang.org/)
[![Conventional Changelog](https://img.shields.io/badge/%20%20%F0%9F%93%A6%F0%9F%9A%80-conventional--changelog-e10079.svg?style=flat)](https://github.com/conventional-changelog/conventional-changelog)
[![lerna--lite](https://img.shields.io/badge/maintained%20with-lerna--lite-e137ff)](https://github.com/lerna-lite/lerna-lite)

[![Actions Status](https://github.com/lerna-lite/lerna-lite/workflows/CI/badge.svg)](https://github.com/lerna-lite/lerna-lite/actions)
[![codecov](https://codecov.io/gh/lerna-lite/lerna-lite/branch/main/graph/badge.svg)](https://codecov.io/gh/lerna-lite/lerna-lite)
[![Vitest](https://img.shields.io/badge/tested%20with-vitest-fcc72b.svg?logo=vitest)](https://vitest.dev/)
[![NPM downloads](https://img.shields.io/npm/dm/@lerna-lite/cli)](https://www.npmjs.com/package/@lerna-lite/cli)
[![npm](https://img.shields.io/npm/v/@lerna-lite/cli.svg?logo=npm&logoColor=fff&label=npm)](https://www.npmjs.com/package/@lerna-lite/cli)

## Lerna-Lite is a super light version of the original [Lerna](https://github.com/lerna/lerna)

- [About Lerna-Lite](#about-lerna-lite)
  - [Why create this lib/fork?](#why-create-this-libfork)
- [Getting Started](#getting-started)
  - [Installation](#installation)
  - [JSON Schema](#json-schema)
  - [Migration for existing Lerna users](#migration-for-existing-lerna-users)
- [Project Demo - See it in Action](https://github.com/lerna-lite/lerna-lite/wiki/Release-Demo)
- [README Badge](#readme-badge)
- [`lerna.json` config file](https://github.com/lerna-lite/lerna-lite/wiki/lerna.json)
- [Contributions](#contributions)
- [Troubleshooting](https://github.com/lerna-lite/lerna-lite/wiki/Troubleshooting)
- **Available Commands** (they are **all optional**, refer to the **[Installation table](#separate--optional-installs)** shown below)
  - _click on any of the command link below to see dedicated documentation and available options_
  - 🛠️ [`init`](https://github.com/lerna-lite/lerna-lite/tree/main/packages/init#readme) - creates a new Lerna-Lite workspace structure and adds `lerna.json`
     - _this is the only command (`init`) included with the CLI_  
  - 🕜 [`changed`](https://github.com/lerna-lite/lerna-lite/tree/main/packages/changed#readme) - list local packages that changed since last tagged release
  - 🌓 [`diff`](https://github.com/lerna-lite/lerna-lite/tree/main/packages/diff#readme) - git diff all packages or a single package since the last release
  - 👷 [`exec`](https://github.com/lerna-lite/lerna-lite/tree/main/packages/exec#readme) - execute shell command in each workspace package
  - 📖 [`list`](https://github.com/lerna-lite/lerna-lite/tree/main/packages/list#readme) - list local packages
  - ☁️ [`publish`](https://github.com/lerna-lite/lerna-lite/tree/main/packages/publish#readme) - publish every workspace packages that changed
  - 📑 [`version`](https://github.com/lerna-lite/lerna-lite/tree/main/packages/version#readme) - create new version for each workspace packages
  - 🏃 [`run`](https://github.com/lerna-lite/lerna-lite/tree/main/packages/run#readme) - run npm script, in topological order, in each workspace package
  - 👓 [`watch`](https://github.com/lerna-lite/lerna-lite/tree/main/packages/watch#readme) - watch for changes within packages and execute commands

---

## 📢 Lerna-Lite supports pnpm/yarn `workspace:` protocol

Take 30sec. to complete this 1 question [poll survey 🔘](https://github.com/lerna-lite/lerna-lite/discussions/156) if you are using this feature. It's a simple poll to find out which package manager is the most popular with this new `workspace:` protocol feature (so far, about 60% pnpm and 40% yarn).

Lerna-Lite itself is also using [pnpm workspaces](https://pnpm.io/workspaces) with the `workspace:` protocol 🎉

---

## Who is using Lerna-Lite

Here are some of the largest projects using this Lerna-Lite fork

<a href="https://github.com/facebook/jest">
  <img src="https://jestjs.io/img/jest.png" width="25" height="25">
  Jest
</a>&nbsp; | &nbsp;
<a href="https://github.com/react-navigation/react-navigation">
  <img src="https://avatars.githubusercontent.com/u/29647600?s=64&v=4" width="25" height="25">
  React Navigation
</a>&nbsp; | &nbsp;
<a href="https://github.com/formatjs/formatjs">
  <img src="https://formatjs.io/img/logo.svg" width="25" height="25">
  Format.JS
</a>&nbsp; | &nbsp;
<a href="https://github.com/johnsoncodehk/volar">
  <img src="https://vue.gallerycdn.vsassets.io/extensions/vue/volar/1.3.16/1681622004073/Microsoft.VisualStudio.Services.Icons.Default" width="25" height="25">
  Volar
</a>&nbsp; | &nbsp;
<a href="https://github.com/standardnotes/app">
  <img src="https://avatars.githubusercontent.com/u/24537496?s=200&amp;v=4" width="25" height="25">
  Standard Notes
</a>&nbsp; | &nbsp;
<a href="https://github.com/nativescript-community" title="NativeScript Community">
  <img src="https://avatars.githubusercontent.com/u/50633791?s=200&v=4" width="25" height="25">
   NativeScript
</a>

## Sponsors

<table>
  <tr>
    <td align="center" valign="middle"><a href="https://github.com/wundergraph" target="_blank"><img src="https://avatars.githubusercontent.com/u/64281914" width="60" height="60" valign="middle" /> Wundergraph</a></td>
  </tr>
</table>

## License

[MIT License](LICENSE)

## About Lerna-Lite

Lerna-Lite differs from the original [Lerna](https://github.com/lerna/lerna) since it only has a limited subset of Lerna's list of commands (which itself has 15 commands) and **all** commands are **optional** in Lerna-Lite making installs typically much smaller. Lerna was originally built as an all-in-one tool, however nowadays Workspaces are available in all package managers and the need for an all-in-one tool, which includes built-in workspaces functionalities (like `bootstrap`), is no longer needed. Lerna-Lite is built around this new reality and is only providing commands that package managers do not include. To summarize, Lerna-Lite is more modular than the original Lerna and you'll end up installing a lot less dependencies also making it more versatile to use with other tools like Turborepo, pnpm and other...

Lerna-Lite assumes, and requires you to pre-setup your Workspace through your favorite package manager (npm, pnpm, yarn) that will take care of the symlinks. Lerna-Lite does **not include** the `bootstrap`, `add`, `create` and `link` commands hence the need for you to properly setup your workspace prior to installing Lerna-Lite.

For more info on how to setup a workspace, choose the best option: [npm 7+](https://docs.npmjs.com/cli/v8/using-npm/workspaces) | [Yarn classic](https://classic.yarnpkg.com/en/docs/workspaces) | [Yarn 2+](https://yarnpkg.com/features/workspaces) | [pnpm](https://pnpm.io/workspaces)

## Why create this lib/fork?

Below are the main reasons as to why this fork was created:

1. Lerna repo was unmaintained for nearly 2 years (in early 2022, Lerna's dependencies were really out of date)
    - this is no longer the case since Nrwl, the company behind Nx, took over stewardship of Lerna
        - please note that Lerna-Lite fork was created couple months **before** Nrwl took over Lerna
        - we now replicate Lerna's PRs when possible (except Nx specific code will not be replicated)
2. A desire to create a smaller and a lighter alternative compared to the original all-in-one Lerna tool
    - Lerna-Lite is entirely modular, all commands are totally optional (install only what you really need).
3. Rewrote the lib in TypeScript and build the project as ESM since v2.0 (you can still use it in a CJS environment)
4. Replicated a few opened PRs from Lerna and add a few unique features into Lerna-Lite (see number 6 below)
5. Lerna is becoming another Nx branded product (Lerna >=5.5 now requires **[Nx](https://nx.dev/)** while not required in Lerna-Lite)
   - if you already use Nx then it's probably better to use Lerna, but if you are not then Lerna-Lite is preferred   
   - if you use other tools like TurboRepo and install Lerna (original) you end up downloading 2 similar tools
   - even TypeScript is now required in Lerna >=6 (even for a JS monorepo) however not required in Lerna-Lite
6. Added a few unique features that are available currently only in Lerna-Lite:
   - [`workspace:` protocol support](https://github.com/lerna-lite/lerna-lite/tree/main/packages/version#workspace-protocol) (*) Lerna added support for the same 6 months later in v6
   - [--dry-run](https://github.com/lerna-lite/lerna-lite/tree/main/packages/version#--dry-run) to preview version/publish & changelogs locally (will show git changes without committing them)
   - [lerna version --changelog-header-message "msg"](https://github.com/lerna-lite/lerna-lite/tree/main/packages/version#--changelog-header-message-msg) for showing banner or sponsors in your changelogs
   - [lerna version --changelog-include-commits-client-login](https://github.com/lerna-lite/lerna-lite/tree/main/packages/version#--changelog-include-commits-client-login-msg) to add PR contributors in GitHub releases
   - [lerna version --allow-peer-dependencies-update](https://github.com/lerna-lite/lerna-lite/tree/main/packages/version#--allow-peer-dependencies-update) to also updated your peer dependencies
   - [lerna version --skip-bump-only-releases](https://github.com/lerna-lite/lerna-lite/tree/main/packages/version#--skip-bump-only-releases) to avoid cluttering your GitHub releases with `independent` mode
   - [lerna version --sync-workspace-lock](https://github.com/lerna-lite/lerna-lite/tree/main/packages/version#--sync-workspace-lock) to sync lock file before publishing (not needed w/`workspace:` protocol)
   - [lerna publish --remove-package-fields](https://github.com/lerna-lite/lerna-lite/tree/main/packages/publish#--remove-package-fields-fields) (remove certain fields from `package.json` before publishing)
      - ie: Lerna-Lite itself uses it to remove `scripts` and `devDependencies`

On a final note, the best feature of Lerna-Lite (versus Lerna) has to be its modularity. A large portion of the users are only interested in version/publish commands but on the other hand, a small minority are only interested in other commands like run/exec. Lerna-Lite offers this flexibility by allowing the user to choose what to install (see [installation](#cli-installation) below). Lastly from the list above, the number 5 could be a concern for some users who are not interested to use Nx (like me) but still want to have the power of Lerna with updated dependencies and keep their download to the bare minimum.

### This lib will help you with the following:

> **Note** all commands are optional in Lerna-Lite, refer to the [Installation table](#separate--optional-installs) for more info

#### [Version](https://github.com/lerna-lite/lerna-lite/tree/main/packages/version) and [Publish](https://github.com/lerna-lite/lerna-lite/tree/main/packages/publish) commands

- Automate the creation of new Versions (`independent` or fixed version) of all your workspace packages.
  - it will automatically Commit/Tag your new Version & create new GitHub/GitLab Release (when enabled).
- Automate, when enabled, the creation of Changelogs for all your packages by reading all [Conventional Commits](https://www.conventionalcommits.org/).
- Automate, the repository Publishing of your new version(s) for all your packages (on NPM or other platforms).

#### Other optional commands

- [Changed](https://github.com/lerna-lite/lerna-lite/tree/main/packages/changed#readme) command, when installed, will list all local packages that have changed since the last tagged release
- [Diff](https://github.com/lerna-lite/lerna-lite/tree/main/packages/diff#readme) command, when installed, will show git diff of all packages or a single package since the last release
- [Exec](https://github.com/lerna-lite/lerna-lite/tree/main/packages/exec#readme) command, when installed, will help you execute shell commands in parallel and in topological order.
- [List](https://github.com/lerna-lite/lerna-lite/tree/main/packages/list#readme) command, when installed, will list all workspace local packages
- [Run](https://github.com/lerna-lite/lerna-lite/tree/main/packages/run#readme) command, when installed, will help you run npm script in parallel and in topological order.
- [Watch](https://github.com/lerna-lite/lerna-lite/tree/main/packages/watch#readme) command, when installed, will watch for changes within all packages and execute certain commands

### README Badge

[![lerna--lite](https://img.shields.io/badge/maintained%20with-lerna--lite-e137ff)](https://github.com/lerna-lite/lerna-lite)

```sh
[![lerna--lite](https://img.shields.io/badge/maintained%20with-lerna--lite-e137ff)](https://github.com/lerna-lite/lerna-lite)
```

## Getting Started

Let's start by installing Lerna-Lite CLI as a dev dependency to your project and then run the `init` command to get started (see [init#readme](https://github.com/lerna-lite/lerna-lite/tree/main/packages/init#readme) for all options). Note that the CLI must be installed at all time, then proceed by installing any other optional commands (the CLI is only including the `init` command), refer to the **[Installation table](#separate--optional-installs)** for more info.

```sh
# install Lerna-Lite CLI locally or globally (`init` is the only command installed)
$ npm install -g @lerna-lite/cli # pnpm add -g @lerna-lite/cli

# create your monorepo and initialize lerna-lite
$ mkdir lerna-repo
$ cd lerna-repo
$ lerna init

# for npm/yarn (only) workspaces add --use-workspaces
$ lerna init --use-workspaces
```

This will create a `lerna.json` configuration file as well as a `packages` folder, so your folder should now look like this:

```
lerna-repo/
  packages/
    package-a
  package.json
  lerna.json
```

**Note** Lerna-Lite now supports 3 file extension types (`.json`, `.jsonc` and `.json5`), the last 2 can accept comments but most code editors (like VSCode) only support [JSON Schema](https://json-schema.org/) and intellisense via `.json` and `.jsonc` extensions but not with `.json5`. Also our parser is very relaxed since we parse all 3 types with `JSON5.parse` so you could in theory add comments to all 3 types, but `.jsonc` or `.json5` are still prefered when adding comments. 

Note that `package-a` will not be created, it is only shown here to help clarify the structure. For more info and full details about the `lerna.json` file, you can read the [lerna.json](https://github.com/lerna-lite/lerna-lite/wiki/lerna.json) Wiki. Also note that you can optionally add comments to your `lerna.json` config file since it is also able to parse JSON5 file format.

Finally install the commands that are of interest to you (`publish`, `version`, `run`, `exec`, ...)

```sh
$ npm i @lerna-lite/publish -D
```

## Installation

> Lerna-Lite is entirely modular, as opposed to Lerna, and installing the CLI locally or globally will only provide you the `init` command. Please make sure to install other commands that you are interested in (see table below).

If you are new to Lerna-Lite, you could also run the [lerna init](https://github.com/lerna-lite/lerna-lite/tree/main/packages/init#readme) command which will create the `lerna.json` for you with a minimal setup. If you are using a different client other than npm, then make sure to update the `npmClient` property in `lerna.json` (for example: `"npmClient": "yarn"` or `"pnpm"`).

> **Note** please make sure that you have a `lerna.json` config file created and a `version` property defined with either a fixed or `independent` mode. An error will be thrown if you're missing any of them.

### JSON Schema
You can add the `$schema` property into your `lerna.json` to take advantage of Lerna-Lite [JSON Schema](https://json-schema.org/) (`lerna init` can help setting it up for you). This will help with the developer experience, users will be able to see what properties are valid with their types and a brief description of what each option does (descriptions are pulled from their associated lerna command options documentation).


##### `lerna.json`
```js
{
  "$schema": "node_modules/@lerna-lite/cli/schemas/lerna-schema.json",
  // ...

  // or from a CDN
  "$schema": "https://raw.githubusercontent.com/lerna-lite/lerna-lite/main/packages/cli/schemas/lerna-schema.json",
}
```

> **Note** we support 3 config file extensions (`.json`, `.jsonc` and `.json5`), however most code editors (like VSCode) do not support JSON Schema with `.json5` extension, so `.jsonc` might be preffered if you wish to add comments.

### Separate / Optional Installs

| Command | Install | Description |
| --------| --------| ----------- |
| ☁️ [publish](https://github.com/lerna-lite/lerna-lite/tree/main/packages/publish#readme) | `npm i @lerna-lite/publish -D` | publish each workspace package |
| 📑 [version](https://github.com/lerna-lite/lerna-lite/tree/main/packages/version#readme) | `npm i @lerna-lite/version -D` | create new version for each workspace package |
| 🕜 [changed](https://github.com/lerna-lite/lerna-lite/tree/main/packages/changed#readme) | `npm i @lerna-lite/changed -D` | list local packages changed since last release |
| 🌓 [diff](https://github.com/lerna-lite/lerna-lite/tree/main/packages/diff#readme)       | `npm i @lerna-lite/diff -D`    | git diff all packages since the last release   |
| 👷 [exec](https://github.com/lerna-lite/lerna-lite/tree/main/packages/exec#readme)       | `npm i @lerna-lite/exec -D`    | execute an command in each workspace package       |
| 📖 [list](https://github.com/lerna-lite/lerna-lite/tree/main/packages/list#readme)       | `npm i @lerna-lite/list -D`    | list local packages                            |
| 🏃 [run](https://github.com/lerna-lite/lerna-lite/tree/main/packages/run#readme)         | `npm i @lerna-lite/run -D`      | run npm script in each workspace package           |
| 👓 [watch](https://github.com/lerna-lite/lerna-lite/tree/main/packages/watch#readme)     | `npm i @lerna-lite/watch -D`    | watch for changes & execute commands when fired |

> **Note** since the `publish` package depends on the `version` package, you could simply install `@lerna-lite/publish` to automatically gain access to both commands.

### Usage

Add custom NPM scripts or simply run the commands in your shell with the Lerna-Lite CLI, you can see below some very basic Lerna npm script samples.

```js
// package.json / npm scripts
"scripts": {
  "new-version": "lerna version",
  "new-publish": "lerna publish from-package",
  "preview:new-version": "lerna version --dry-run",
  "run-tests": "lerna run test",
}
```

### Migration for existing [Lerna](https://github.com/lerna/lerna) users

Migrating from the original Lerna, should be fairly easy since you simply need to replace your Lerna dependency with Lerna-Lite `@lerna-lite/cli`, then install all the commands that you are interested in and that's it. The CLI commands and options are the same. The biggest difference compared to Lerna is that you need to install the commands that you are interested in, for that take a look at the steps shown below:

> **Note** as opposed to Lerna v7 and higher, the `useWorkspace` is **not** enabled by default in Lerna-Lite and we still recommend to use either `useWorkspaces` for Yarn/NPM or use the default `packages` in `lerna.json` for pnpm users. The `useWorkspaces` has some drawback since some of the packages could be unrelated to the project releases (ie: website, examples) and for this use case the `packages/*` defined in `lerna.json` could be better (i.e. [Jest](https://github.com/facebook/jest) uses this approach).

1. remove Lerna from your local & global dependencies

```sh
npm uninstall lerna      # OR yarn remove lerna -W
npm uninstall -g lerna   # OR yarn global remove lerna
```

2. install Lerna-Lite CLI, note this **only** provides you the `init` command

```sh
# Lerna CLI (includes `init`)
npm install @lerna-lite/cli -D
```

3. then install any of the optional Lerna-Lite command(s) that you wish to use (`changed`, `diff`, `exec`, `list`, `run`, `publish`, `version` and/or `watch`)
_refer to [installation](#installation) table above_

```sh
# for example, let's install publish (note publish will automatically give you version since it's a dependency)
npm install @lerna-lite/publish -D
```

4. review your `lerna.json` config file and remove any unrelated command options, for example `bootstrap` does not exist in Lerna-Lite so there's no need to keep that config
```diff
{
    "npmClient": "yarn",
    "command": {
        "version": {
            "conventionalCommits": true
        },
-       "bootstrap": {
-           "npmClientArgs": ["--no-package-lock"]
-       }
    }
}
```
> **Note** after switching to Lerna-Lite and publishing your next release with conventional-changelog, you will probably see a lot of diff changes across your `changelog.md` files, many empty lines will be deleted, and that is totally expected since Lerna-Lite has code in place to remove these empty lines that were added by Lerna for no reason.

## Project Demo?

You want to see a project demo? Sure... you're looking at it 😉

Yes indeed, this project was originally created as an NPM Workspace and later migrated to a [pnpm workspaces](https://pnpm.io/workspaces) for the sole purpose of demoing and testing its own code. All changelogs and versions are created and published by the lib itself, how sweet is that? You can also see that this project has its own [`lerna.json`](https://github.com/lerna-lite/lerna-lite/blob/main/lerna.json) config file as well to run properly (take a look to see how it works).

### See it in Action 🎦

You can see a small video of a new version release on this [Release Demo - Wiki](https://github.com/lerna-lite/lerna-lite/wiki/Release-Demo) to demonstrate its usage. Confused with all these options? Perhaps taking a look at some of the references shown below might help you get started.

### Good Lerna Tutorials / References

- [Release Demo - Wiki](https://github.com/lerna-lite/lerna-lite/wiki/Release-Demo) - Lerna-Lite demo (animated gif)
- [How to Use Lerna](https://www.youtube.com/watch?v=p6qoJ4apCjA) - YouTube video
- [Lerna Release Workflow](https://github.com/curiousNoob/lerna-release-workflow) - GitHub Template

## Contributions

[![PR](https://img.shields.io/badge/PR-Welcome-1abc9c)](https://github.com/lerna-lite/lerna-lite/pulls)

Feel free to contribute any Pull Request. Also please note that the original code was not created by me and my knowledge of the library is still limited in some sections of the project. The main goal of this fork was to make it more modular and keep dependencies up to date (Renovate was put in place and runs weekly). 

### Development / Contributions

To contribute to the project, please follow the steps shown in the [Contributing Guide](https://github.com/lerna-lite/lerna-lite/blob/main/CONTRIBUTING.md)

## Troubleshooting

If you have problems running the lib and your problems are related to Git commands that were executed, then we suggest to first try with the `--dry-run` option to see if it helps in finding the error(s) that you may have. Another great, and possibly much more useful suggestion, is to search in the original Lerna [issues](https://github.com/lerna/lerna/issues) list and see if any solution could help you (remember that Lerna-Lite is a fork of the original code from Lerna and it works the same way). Lastly, if that is not enough and you wish to troubleshoot yourself, then read this [Troubleshooting - Wiki](https://github.com/lerna-lite/lerna-lite/wiki/Troubleshooting) to possibly troubleshoot yourself the execution in your own environment.

## Lerna-Lite Full List of Packages

| Package Name | Version | Description | Changes |
| ------------ | ------- | ----------- | ------- |
| [@lerna-lite/cli](https://github.com/lerna-lite/lerna-lite/tree/main/packages/cli) | [![npm](https://img.shields.io/npm/v/@lerna-lite/cli.svg)](https://www.npmjs.com/package/@lerna-lite/cli) | Lerna-Lite CLI required to execute any command | [changelog](https://github.com/lerna-lite/lerna-lite/blob/main/packages/cli/CHANGELOG.md) |
| [@lerna-lite/core](https://github.com/lerna-lite/lerna-lite/tree/main/packages/core) | [![npm](https://img.shields.io/npm/v/@lerna-lite/core.svg)](https://www.npmjs.com/package/@lerna-lite/core) | Lerna-Lite core & shared methods (internal use) | [changelog](https://github.com/lerna-lite/lerna-lite/blob/main/packages/core/CHANGELOG.md) |
| [@lerna-lite/init](https://github.com/lerna-lite/lerna-lite/tree/main/packages/init) | [![npm](https://img.shields.io/npm/v/@lerna-lite/init.svg)](https://www.npmjs.com/package/@lerna-lite/init) | Setup your monorepo to use Lerna-Lite | [changelog](https://github.com/lerna-lite/lerna-lite/blob/main/packages/init/CHANGELOG.md) |
| [@lerna-lite/publish](https://github.com/lerna-lite/lerna-lite/tree/main/packages/publish) | [![npm](https://img.shields.io/npm/v/@lerna-lite/publish.svg)](https://www.npmjs.com/package/@lerna-lite/publish) | Publish packages in the current workspace | [changelog](https://github.com/lerna-lite/lerna-lite/blob/main/packages/publish/CHANGELOG.md)             |
| [@lerna-lite/version](https://github.com/lerna-lite/lerna-lite/tree/main/packages/version) | [![npm](https://img.shields.io/npm/v/@lerna-lite/version.svg)](https://www.npmjs.com/package/@lerna-lite/version) | Bump Version & write Changelogs | [changelog](https://github.com/lerna-lite/lerna-lite/blob/main/packages/version/CHANGELOG.md) |
| [@lerna-lite/exec](https://github.com/lerna-lite/lerna-lite/tree/main/packages/exec) | [![npm](https://img.shields.io/npm/v/@lerna-lite/exec.svg)](https://www.npmjs.com/package/@lerna-lite/exec) | Execute shell command in current workspace   | [changelog](https://github.com/lerna-lite/lerna-lite/blob/main/packages/exec/CHANGELOG.md) |
| [@lerna-lite/changed](https://github.com/lerna-lite/lerna-lite/tree/main/packages/changed) | [![npm](https://img.shields.io/npm/v/@lerna-lite/changed.svg)](https://www.npmjs.com/package/@lerna-lite/changed) | List local packages that changed since last release | [changelog](https://github.com/lerna-lite/lerna-lite/blob/main/packages/changed/CHANGELOG.md) |
| [@lerna-lite/diff](https://github.com/lerna-lite/lerna-lite/tree/main/packages/diff) | [![npm](https://img.shields.io/npm/v/@lerna-lite/diff.svg)](https://www.npmjs.com/package/@lerna-lite/diff) | Diff all packages or a single package since last release| [changelog](https://github.com/lerna-lite/lerna-lite/blob/main/packages/diff/CHANGELOG.md) |
| [@lerna-lite/list](https://github.com/lerna-lite/lerna-lite/tree/main/packages/list) | [![npm](https://img.shields.io/npm/v/@lerna-lite/list.svg)](https://www.npmjs.com/package/@lerna-lite/list) | List local packages | [changelog](https://github.com/lerna-lite/lerna-lite/blob/main/packages/list/CHANGELOG.md) |
| [@lerna-lite/listable](https://github.com/lerna-lite/lerna-lite/tree/main/packages/listable) | [![npm](https://img.shields.io/npm/v/@lerna-lite/listable.svg)](https://www.npmjs.com/package/@lerna-lite/listable) | Listable utils used by `list` and `changed` commands (internal use) | [changelog](https://github.com/lerna-lite/lerna-lite/blob/main/packages/listable/CHANGELOG.md) |
| [@lerna-lite/filter-packages](https://github.com/lerna-lite/lerna-lite/tree/main/packages/filter-packages) | [![npm](https://img.shields.io/npm/v/@lerna-lite/filter-packages.svg)](https://www.npmjs.com/package/@lerna-lite/filter-packages) | Lerna-Lite filtering package utils used by optional commands (internal use) | [changelog](https://github.com/lerna-lite/lerna-lite/blob/main/packages/filter-packages/CHANGELOG.md) |
| [@lerna-lite/profiler](https://github.com/lerna-lite/lerna-lite/tree/main/packages/profiler) | [![npm](https://img.shields.io/npm/v/@lerna-lite/profiler.svg)](https://www.npmjs.com/package/@lerna-lite/profiler) | Lerna-Lite Profiler used by some optional commands (internal use) | [changelog](https://github.com/lerna-lite/lerna-lite/blob/main/packages/profiler/CHANGELOG.md) |
| [@lerna-lite/run](https://github.com/lerna-lite/lerna-lite/tree/main/packages/run) | [![npm](https://img.shields.io/npm/v/@lerna-lite/run.svg)](https://www.npmjs.com/package/@lerna-lite/run) | Run npm scripts in current workspace | [changelog](https://github.com/lerna-lite/lerna-lite/blob/main/packages/run/CHANGELOG.md) |
| [@lerna-lite/watch](https://github.com/lerna-lite/lerna-lite/tree/main/packages/watch) | [![npm](https://img.shields.io/npm/v/@lerna-lite/watch.svg)](https://www.npmjs.com/package/@lerna-lite/watch) | Watch for changes within packages and execute commands | [changelog](https://github.com/lerna-lite/lerna-lite/blob/main/packages/watch/CHANGELOG.md) |

## Sponsors

<table>
  <tr>
    <td align="center" valign="middle"><a href="https://github.com/wundergraph" target="_blank"><img src="https://avatars.githubusercontent.com/u/64281914" width="60" height="60" valign="middle" /> Wundergraph</a></td>
  </tr>
</table>
