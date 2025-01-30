//@ts-check

import { composePlugins, withNx } from '@nx/next';
import nextI18nextConfig from './next-i18next.config.js';

/**
 * @type {import('@nx/next/plugins/with-nx').WithNxOptions}
 **/
const nextConfig = {
  nx: {
    // Set this to true if you would like to use SVGR
    // See: https://github.com/gregberge/svgr
    svgr: false,
  },

  // @ts-ignore
  i18n: nextI18nextConfig.i18n,
  basePath: '/youthnet', // This should match the path set in Nginx
};

const plugins = [
  // Add more Next.js plugins to this list if needed.
  withNx,
];

export default composePlugins(...plugins)(nextConfig);
