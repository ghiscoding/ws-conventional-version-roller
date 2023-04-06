import { describe, expect, it, Mock, vi } from 'vitest';

vi.mock('read-package-json');
vi.mock('libnpmpublish');
vi.mock('fs/promises');

vi.mock('@lerna-lite/core', async () => ({
  ...(await vi.importActual<any>('@lerna-lite/core')),
  otplease: (cb, opts) => Promise.resolve(cb(opts)),
  runLifecycle: (await vi.importActual<any>('../../../core/src/__mocks__/run-lifecycle')).runLifecycle,
}));

// mocked modules
import { readFile } from 'fs/promises';
import { publish } from 'libnpmpublish';
import readJSON from 'read-package-json';
import { runLifecycle, Package, RawManifest } from '@lerna-lite/core';

// helpers
import { join, normalize } from 'node:path';

// file under test
import { npmPublish } from '../lib/npm-publish';
import { LibNpmPublishOptions } from '../models';

describe('npm-publish', () => {
  const mockTarData = Buffer.from('MOCK');
  const mockManifest = { _normalized: true };

  (readFile as Mock).mockName('readFile').mockResolvedValue(mockTarData);
  (publish as Mock).mockName('libnpmpublish').mockResolvedValue(null);
  (readJSON as unknown as Mock).mockName('read-package-json').mockImplementation((file, cb) => cb(null, mockManifest));
  (runLifecycle as Mock).mockName('@lerna-lite/core').mockResolvedValue(null);

  const tarFilePath = '/tmp/test-1.10.100.tgz';
  const rootPath = normalize('/test');
  const pkg = new Package({ name: '@scope/test', version: '1.10.100' } as RawManifest, join(rootPath, 'npmPublish/test'), rootPath);

  it('calls external libraries with correct arguments', async () => {
    const opts = { tag: 'published-tag' };

    await npmPublish(pkg, tarFilePath, opts);

    expect(readFile).toHaveBeenCalledWith(tarFilePath);
    expect(readJSON).toHaveBeenCalledWith(pkg.manifestLocation, expect.any(Function));
    expect(publish).toHaveBeenCalledWith(
      mockManifest,
      mockTarData,
      expect.objectContaining({
        defaultTag: 'published-tag',
        projectScope: '@scope',
      })
    );
  });

  it("defaults opts.tag to 'latest'", async () => {
    await npmPublish(pkg, tarFilePath, {});

    expect(publish).toHaveBeenCalledWith(
      mockManifest,
      mockTarData,
      expect.objectContaining({
        defaultTag: 'latest',
      })
    );
  });

  it('overrides pkg.publishConfig.tag when opts.tag is explicitly configured', async () => {
    (readJSON as unknown as Mock).mockImplementationOnce((file, cb) =>
      cb(null, {
        publishConfig: {
          tag: 'beta',
        },
      })
    );
    const opts = { tag: 'temp-tag' };

    await npmPublish(pkg, tarFilePath, opts);

    expect(publish).toHaveBeenCalledWith(
      expect.objectContaining({
        publishConfig: {
          tag: 'temp-tag',
        },
      }),
      mockTarData,
      expect.objectContaining({
        defaultTag: 'temp-tag',
      })
    );
  });

  it('respects pkg.publishConfig.tag when opts.defaultTag matches default', async () => {
    (readJSON as unknown as Mock).mockImplementationOnce((file, cb) =>
      cb(null, {
        publishConfig: {
          tag: 'beta',
        },
      })
    );

    await npmPublish(pkg, tarFilePath);

    expect(publish).toHaveBeenCalledWith(
      expect.objectContaining({
        publishConfig: {
          tag: 'beta',
        },
      }),
      mockTarData,
      expect.objectContaining({
        defaultTag: 'beta',
      })
    );
  });

  it('uses pkg.contents manifest when pkg.publishConfig.directory is defined', async () => {
    const fancyPkg = new Package(
      {
        name: 'fancy',
        version: '1.10.100',
        publishConfig: {
          directory: 'dist',
        },
      } as RawManifest,
      join(rootPath, 'npmPublish/fancy'),
      rootPath
    );

    (readJSON as unknown as Mock).mockImplementationOnce((file, cb) =>
      cb(null, {
        name: 'fancy-fancy',
        version: '1.10.100',
      })
    );

    await npmPublish(fancyPkg, tarFilePath);

    expect(readJSON).toHaveBeenCalledWith(join(fancyPkg.location, 'dist/package.json'), expect.any(Function));
    expect(publish).toHaveBeenCalledWith(
      expect.objectContaining({
        name: 'fancy-fancy',
      }),
      mockTarData,
      expect.objectContaining({
        defaultTag: 'latest',
      })
    );
  });

  it('merges pkg.publishConfig.registry into options', async () => {
    (readJSON as unknown as Mock).mockImplementationOnce((file, cb) =>
      cb(null, {
        publishConfig: {
          registry: 'http://pkg-registry.com',
        },
      })
    );
    const opts = { registry: 'https://global-registry.com' };

    await npmPublish(pkg, tarFilePath, opts as any);

    expect(publish).toHaveBeenCalledWith(
      expect.objectContaining({
        publishConfig: {
          registry: 'http://pkg-registry.com',
        },
      }),
      mockTarData,
      expect.objectContaining({
        registry: 'http://pkg-registry.com',
      })
    );
  });

  it('respects opts.dryRun', async () => {
    const opts = { dryRun: true };

    await npmPublish(pkg, tarFilePath, opts);

    expect(publish).not.toHaveBeenCalled();
    expect(runLifecycle).toHaveBeenCalledTimes(2);
  });

  it.each([['true'], [true], ['false'], [false]])('aliases strict-ssl to strictSSL', async (strictSSLValue) => {
    const opts = { 'strict-ssl': strictSSLValue } as Partial<LibNpmPublishOptions>;

    await npmPublish(pkg, tarFilePath, opts);

    expect(publish).toHaveBeenCalledWith(
      expect.anything(),
      expect.anything(),
      expect.objectContaining({
        strictSSL: strictSSLValue,
      })
    );
  });

  it('calls publish lifecycles', async () => {
    const options = expect.objectContaining({
      projectScope: '@scope',
    });

    await npmPublish(pkg, tarFilePath);

    expect(runLifecycle).toHaveBeenCalledWith(pkg, 'publish', options);
    expect(runLifecycle).toHaveBeenLastCalledWith(pkg, 'postpublish', options);
  });
});
