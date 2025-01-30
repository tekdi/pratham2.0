module.exports = {
  apps: [
    {
      name: 'teachers',
      script: 'node_modules/.bin/next',
      args: 'start -p 3001',
      cwd: 'apps/teachers',
      env: {
        NODE_ENV: 'production',
      },
    },
    {
      name: 'authentication',
      script: 'node_modules/.bin/next',
      args: 'start -p 4101',
      cwd: 'mfes/authentication',
      env: {
        NODE_ENV: 'production',
      },
    },
    {
      name: 'scp-teacher',
      script: 'node_modules/.bin/next',
      args: 'start -p 4102',
      cwd: 'mfes/scp-teacher',
      env: {
        NODE_ENV: 'production',
      },
    },
    {
      name: 'youthNet',
      script: 'node_modules/.bin/next',
      args: 'start -p 4103',
      cwd: 'mfes/youthNet',
      env: {
        NODE_ENV: 'production',
      },
    },
  ],
};
