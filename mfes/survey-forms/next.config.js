//@ts-check

// eslint-disable-next-line @typescript-eslint/no-var-requires
const { composePlugins, withNx } = require('@nx/next');

const SURVEY_API_UPSTREAM =
  process.env.SURVEY_API_UPSTREAM_URL ||
  process.env.NEXT_PUBLIC_SURVEY_API_BASE_URL ||
  process.env.NEXT_PUBLIC_SURVEY_FORMS_API_URL ||
  'https://dev-survey.prathamdigital.org';

/**
 * @type {import('@nx/next/plugins/with-nx').WithNxOptions}
 **/
const nextConfig = {
  nx: {
    // Set this to true if you would like to use SVGR
    // See: https://github.com/gregberge/svgr
    svgr: false,
  },
  basePath: '/plp-surveys', // This should match the path set in Nginx
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: `${SURVEY_API_UPSTREAM}/api/:path*`,
      },
    ];
  },
};

const plugins = [
  // Add more Next.js plugins to this list if needed.
  withNx,
];

module.exports = composePlugins(...plugins)(nextConfig);
