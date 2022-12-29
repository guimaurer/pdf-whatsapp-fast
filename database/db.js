const Sequelize = require('sequelize');
const sequelize = new Sequelize({
    dialect: 'sqlite',
    storage: '/workspace/pdf-whatsapp-fast/database/database.sqlite'
  })
 
module.exports = sequelize;