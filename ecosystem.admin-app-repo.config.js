module.exports = {
  apps: [
    {
      name: 'admin-app-repo',
      script: 'node_modules/.bin/nx',
      args: 'start admin-app-repo --port=3002',
      cwd: '.',
      env: {
        NODE_ENV: 'production',
      },
    },
    {
      name: 'workspace',
      script: 'node_modules/.bin/nx',
      args: 'start workspace --port=4104',
      cwd: '.',
      env: {
        NODE_ENV: 'production',
      },
    },
    {
      name: 'players',
      script: 'node_modules/.bin/nx',
      args: 'start players --port=4106',
      cwd: '.',
      env: {
        NODE_ENV: 'production',
      },
    },
  ],
};
