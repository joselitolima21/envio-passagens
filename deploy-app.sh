yarn
NODE_ENV=production yarn sequelize db:create
NODE_ENV=production yarn sequelize db:migrate
pm2 start --name=envio-passagens npm -- start
pm2 startup systemd