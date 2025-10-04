module.exports = {
  apps: [{
    name: 'plaza-toolkit',
    script: '/home/abodi/.npm-global/bin/pnpm',
    args: 'start',
    cwd: '/var/www/web-server/plaza-toolkit/apps/web',
    instances: 1,
    exec_mode: 'fork',
    autorestart: true,
    watch: false,
    max_memory_restart: '1G',
    env: {
      NODE_ENV: 'production',
      DATABASE_URL: 'file:./packages/database/prisma/dev.db',
      JWT_SECRET: 'plaza-jwt-secret-key-change-this-in-production',
      JWT_EXPIRES_IN: '7d',
      NEXT_PUBLIC_APP_URL: 'http://164.90.196.41',
      MAX_FILE_SIZE: '10485760',
      UPLOAD_DIR: '/var/www/web-server/plaza-toolkit/uploads'
    }
  }]
}