module.exports = {
  apps: [{
    name: 'Development GOZ-Web Server API',
    script: './dist/index.js',

    // Options reference: https://pm2.io/doc/en/runtime/reference/ecosystem-file/
    args: '',
    instances: 1,
    autorestart: true,
    watch: true,
    exec_interpreter: "node",
    exec_mode: "cluster",
    max_memory_restart: '1G',
    source_map_support: true,
    ignore_watch: ["public", "node_modules", ".idea", ".vscode"],
    node_args: [
      "--inspect",
    ],
    env_development: {
      NODE_ENV: 'development',
      SOCKET_PORT: 4000,
      PORT: 4001,
      DOMAIN: "http://217.182.193.137:4001",
      CROSS_DOMAIN: "*"
    },
    env_stage: {
      NODE_ENV: 'stage',
      SOCKET_PORT: 4004,
      PORT: 4005,
      DOMAIN: "http://217.182.193.137:4005",
      CROSS_DOMAIN: "*"
    },
    env_production: {
      NODE_ENV: 'production',
      SOCKET_PORT: 4002,
      PORT: 4003,
      DOMAIN: "http://217.182.193.137:4003",
      CROSS_DOMAIN: "*"
    },
  }],

  // deploy : {
  //   production : {
  //     user : 'animemi2',
  //     host : '217.182.193.137',
  //     ref  : 'origin/master',
  //     repo : 'git@github.com:repo.git',
  //     path : '/var/www/production',
  //     'post-deploy' : 'npm install && pm2 reload ecosystem.config.js --env production'
  //   }
  // }
};