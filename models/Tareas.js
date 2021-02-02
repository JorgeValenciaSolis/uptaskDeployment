// MODELO CONTIENE LAS CONSULTAS A LA BD

const Sequelize = require('sequelize');

const db = require('../config/db');

// importando proyectos para hacer la relacion de tablas
const Proyectos = require('./Proyectos');

const Tareas = db.define('Tareas',  {
    id :{
        type         : Sequelize.INTEGER(11),
        primaryKey   : true,
        autoIncrement: true
    },

    tarea            : Sequelize.STRING(100),
    estado           : Sequelize.INTEGER(1)
  
});

Tareas.belongsTo(Proyectos);

module.exports = Tareas;