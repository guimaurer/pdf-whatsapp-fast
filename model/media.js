const Sequelize = require('sequelize');
const database = require('../database/db');
 
const Media = database.define('media', {
    id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true
    },
    type_media: {
        type: Sequelize.INTEGER,
        allowNull: false
    },
    phone_number: {
        type: Sequelize.INTEGER,
        allowNull: false
    },
    media_path: {
        type: Sequelize.STRING,
        allowNull: false
    },
})
 
module.exports = Media;