module.exports = {
  apps: [
    {
      name: 'admin-app-repo',
      script: 'node_modules/.bin/next',
      args: 'start -p 3002',
      cwd: 'apps/admin-app-repo',
      env: {
        NODE_ENV: 'production',
      },
    },
  ],
};
