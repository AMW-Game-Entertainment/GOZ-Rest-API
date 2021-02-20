cd "/var/www/html/GOZ-Web-Server-Dev/"
rm -rf node_modules
rm -rf yarn.lock
rm -rf package-lock.json
ls
git pull
ls
yarn install
yarn build
pm2 reload ecosystem.config.js --env development
ls