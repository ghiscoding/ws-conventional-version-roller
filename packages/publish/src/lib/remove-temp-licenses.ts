import { remove } from 'fs-extra/esm';
import pMap from 'p-map';

import { Package } from '@lerna-lite/core';

/**
 * Remove temporary license files.
 * @param {Package[]} packagesToBeLicensed
 */
export function removeTempLicenses(packagesToBeLicensed: Package[]): Promise<void | void[]> {
  if (!packagesToBeLicensed.length) {
    return Promise.resolve();
  }

  return pMap(packagesToBeLicensed, (pkg) => remove(pkg.licensePath));
}
