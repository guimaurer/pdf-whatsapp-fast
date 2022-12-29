const Sequelize = require('sequelize');
const sequelize = new Sequelize({
    dialect: 'sqlite',
    storage: '/workspace/whatsapp_bot/database/database.sqlite'
  })
 
module.exports = sequelize;