module.exports = {
  apps: [
    {
      name: 'rpi-relay-controller',
      script: 'src/App.js',
      interpreter: 'node',
      interpreter_args: [
        '-r', 'ts-node/register',
        '-r', 'tsconfig-paths/register'
      ],
      max_memory_restart: '500M',
      instances: 1,
      wait_ready: true,
      autorestart: true,
      watch: false
    }
  ]
};
