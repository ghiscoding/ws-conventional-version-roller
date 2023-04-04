import path from 'path';

import { Conf } from '../utils/conf.js';
import { toNerfDart } from './nerf-dart.js';
import { Defaults } from './defaults.js';

// https://github.com/npm/npm/blob/latest/lib/config/core.js#L101-L200
function npmConf(opts: any) {
  const conf = new Conf(Object.assign({}, new Defaults().defaults));

  // prevent keys with undefined values from obscuring defaults
  // prettier-ignore
  const cleanOpts = opts
    ? Object.keys(opts).reduce((acc, key) => {
        if (opts[key] !== undefined) {
          // eslint-disable-next-line no-param-reassign
          acc[key] = opts[key];
        }
        return acc;
      }, {})
    : {};

  conf.add(cleanOpts, 'cli');
  conf.addEnv();
  conf.loadPrefix();

  const projectConf = path.resolve(conf.localPrefix, '.npmrc');
  const userConf = conf.get('userconfig');

  /* istanbul ignore else */
  if (!conf.get('global') && projectConf !== userConf) {
    conf.addFile(projectConf, 'project');
  } else {
    conf.add({}, 'project');
  }

  conf.addFile(conf.get('userconfig'), 'user');

  /* istanbul ignore else */
  if (conf.get('prefix')) {
    const etc = path.resolve(conf.get('prefix'), 'etc');
    conf.root.globalconfig = path.resolve(etc, 'npmrc');
    conf.root.globalignorefile = path.resolve(etc, 'npmignore');
  }

  conf.addFile(conf.get('globalconfig'), 'global');
  conf.loadUser();

  const caFile = conf.get('cafile');

  /* istanbul ignore if */
  if (caFile) {
    conf.loadCAFile(caFile);
  }

  return conf;
}

export { Conf, npmConf, toNerfDart };
