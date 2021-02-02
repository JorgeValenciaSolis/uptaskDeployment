// MODELO CONTIENE LAS CONSULTAS A LA BD

const Sequelize = require('sequelize');

const db = require('../config/db');

// importando proyectos para hacer la relacion de tablas
const Proyectos = require('./Proyectos');

// importar  Bcript
const bcrypt = require('bcrypt-nodejs');


const Usuarios = db.define('Usuarios',  {
    id :{
        type         : Sequelize.INTEGER(11),
        primaryKey   : true,
        autoIncrement: true
    },

    email :{ 
        type         :Sequelize.STRING(60),
        allowNull    : false,
        validate: { 
            isEmail: {
                msg: 'Agrega un Correo Valido'
            },
            notEmpty: {
                msg: 'El Email no puede ir Vacio'
            }
        },
        unique : {
            args: true,
            msg: 'Usuario YA REGISTRADO'
        }
     },
    password:{ 
        type         :Sequelize.STRING(60),
        allowNull    : false,
        validate: {
            notEmpty: {
                msg: 'El password no puede ir Vacio'
            }
        }
    },
    activo:{
        type: Sequelize.INTEGER,
        defaultValue: 0
    },
    token: Sequelize.STRING,
    expiracion: Sequelize.DATE
  
}, {
    hooks: {
        beforeCreate(Usuario){
            Usuario.password = bcrypt.hashSync(Usuario.password, bcrypt.genSaltSync(10) );
        }
        
    }

});

// Metodos PERSONALISADOS
Usuarios.prototype.verficarPassword = function (password) {
    return bcrypt.compareSync(password, this.password);
}
Usuarios.hasMany(Proyectos);

module.exports = Usuarios;
