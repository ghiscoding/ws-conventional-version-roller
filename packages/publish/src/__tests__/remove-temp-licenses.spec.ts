import fs from 'fs-extra';
import path from 'path';
import { Project } from '@lerna-lite/core';
import { removeTempLicenses } from '../lib/remove-temp-licenses';
import { initFixtureFactory } from '@lerna-test/helpers';
import { fileURLToPath } from 'url';
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const initFixture = initFixtureFactory(__dirname);

describe('removeTempLicenses', () => {
  it('removes license file from target packages', async () => {
    const cwd = await initFixture('licenses-names');
    const project = new Project(cwd);
    const [pkg] = await project.getPackages();

    // mimic decoration in createTempLicenses()
    pkg.licensePath = path.join(pkg.location, 'LICENSE');

    await removeTempLicenses([pkg]);

    const tempLicensePresent = await fs.pathExists(pkg.licensePath);
    expect(tempLicensePresent).toBe(false);
  });

  it('skips removal when no target packages exist', async () => {
    const cwd = await initFixture('licenses-names');
    const project = new Project(cwd);
    const [pkg] = await project.getPackages();

    // mimic decoration in createTempLicenses()
    pkg.licensePath = path.join(pkg.location, 'LICENSE');

    await removeTempLicenses([]);

    const licensePresent = await fs.pathExists(pkg.licensePath);
    expect(licensePresent).toBe(true);
  });
});
