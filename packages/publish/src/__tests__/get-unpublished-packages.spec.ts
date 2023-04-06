import { expect, test, vi } from 'vitest';

vi.mock('pacote');

// mocked module(s)
import pacote from 'pacote';

// helpers
import { fileURLToPath } from 'node:url';
import { dirname } from 'node:path';
import { Project, PackageGraph, FetchConfig } from '@lerna-lite/core';
import { initFixtureFactory } from '@lerna-test/helpers';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const initFixture = initFixtureFactory(__dirname);

// file under test
import { getUnpublishedPackages } from '../lib/get-unpublished-packages';

(pacote as any).packument.mockImplementation(async (pkg) => {
  if (pkg === 'package-1') {
    return {
      versions: {},
    };
  }

  if (pkg === 'package-2') {
    return {
      versions: {
        '1.0.0': {},
      },
    };
  }

  throw new Error('package does not exist');
});

test('getUnpublishedPackages', async () => {
  const cwd = await initFixture('licenses-names');
  const packages = await Project.getPackages(cwd);
  const packageGraph = new PackageGraph(packages);

  const opts = {};
  const pkgs = await getUnpublishedPackages(packageGraph, opts as FetchConfig);

  expect((pacote as any).packument).toHaveBeenCalledWith('package-1', opts);
  expect(pkgs).toMatchInlineSnapshot(`
    [
      PackageGraphNode {
        'externalDependencies': Map {},
        'localDependencies': Map {},
        'localDependents': Map {},
        'name': 'package-1',
      },
      PackageGraphNode {
        'externalDependencies': Map {},
        'localDependencies': Map {},
        'localDependents': Map {},
        'name': 'package-3',
      },
      PackageGraphNode {
        'externalDependencies': Map {},
        'localDependencies': Map {},
        'localDependents': Map {},
        'name': 'package-4',
      },
      PackageGraphNode {
        'externalDependencies': Map {},
        'localDependencies': Map {},
        'localDependents': Map {},
        'name': 'package-5',
      },
    ]
  `);
});

test('getUnpublishedPackages with private package', async () => {
  const cwd = await initFixture('public-private');
  const packages = await Project.getPackages(cwd);
  const packageGraph = new PackageGraph(packages);

  const opts = {};
  const pkgs = await getUnpublishedPackages(packageGraph, opts as FetchConfig);

  expect((pacote as any).packument).toHaveBeenCalledWith('package-1', opts);
  expect(pkgs).toMatchInlineSnapshot(`
    [
      PackageGraphNode {
        'externalDependencies': Map {},
        'localDependencies': Map {},
        'localDependents': Map {},
        'name': 'package-1',
      },
    ]
  `);
});
