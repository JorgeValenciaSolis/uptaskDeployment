const passport = require('passport');

// importar el moelo de Usuarios
const Usuarios = require('../models/Usuarios');

// importar operadores Sequellize
const Sequelize = require('sequelize');
const Op = Sequelize.Op;

// Utileria de Node que permite genear un token
const crypto = require('crypto');

// importar  Bcript encriptar el password
const bcrypt = require('bcrypt-nodejs');

// importar  email para enviar el corrreo
const enviarEmail = require('../handlers/email');


// Autentificar con el metodo LOCAL
exports.autenticarUsuario = passport.authenticate('local', {
    successRedirect: '/',
    failureRedirect: 'iniciar-sesion',
    failureFlash: true,
    badRequestMessage: 'Ambos Campos Son Obligatorios'

});

// funcion para revisar si el usuario esta logeado o no
exports.usuarioAutenticado = (req, res, next) => {
    
    // si el usuario esta autenticado adelante
    if (req.isAuthenticated()) {
        return next(); 
    }

    // si NO redirigelo al Formulario

    return res.redirect('iniciar-sesion');

}

// funcion para cerrar sesion

exports.cerrarSesion = (req, res) => {
    req.session.destroy(() =>{
        res.redirect('/iniciar-sesion');    // nos lleva a iniciar session
    })
}

// genera un Token si el Usuario es Valido
exports.enviarToken = async (req, res, next) =>{

    // verificar que exista el email
    const {email} = req.body;
    const usuario = await Usuarios.findOne({where: { email }});

    // si no existe el email
    if (!usuario) {
        req.flash('error', 'No existe el e-mail');
        res.redirect('/reestablecer');
        return next();
        
    }

    // usuario existe creo un token y fecha de expiracion 
    usuario.token = crypto.randomBytes(20).toString('hex');
    usuario.expiracion = Date.now() + 3600000;

    // guardar token y expiracion en la BD
    await usuario.save();

    // url de reset
    const resetUrl = `http://${req.headers.host}/reestablecer/${usuario.token}`;

    // Enviar el Correo  con el Token 
    //console.log(resetUrl);

    await enviarEmail.enviar({
        usuario : usuario, 
        subject : 'Password Reset',
        resetUrl,         //  resetUrl: resetUrl solo se pone resetUrl
        archivo : 'reestablecer-password'
    });

    // redireccionar
    req.flash('correcto', 'Se envio un mensaje a tu Correo');
    res.redirect('/iniciar-sesion');
}

// Validar el token
exports.validarToken = async (req, res, next) =>{
    const usuario = await Usuarios.findOne({
        where: {
            token: req.params.token
        } 
    });
    // si no encuentra al Usuario
    if (!usuario) {
        req.flash('error', 'Token No Valido');
        res.redirect('/reestablecer');
        return next();
    }
    
    // formulario para generar el password
    res.render('resetPassword', {
        nombrePagina: 'Reestablecer Contraseña'
    });
}  

// Restablecer el Password
exports.actualizarPassword = async (req, res, next) =>{ 
    // Verifica el token y la fecha de expiracion validos
    const usuario = await Usuarios.findOne({
        where: {
            token: req.params.token,
            expiracion: {
                [Op.gte]: Date.now()
            }
        }
    });
    
    // verificamos si el usuario existe
  if (!usuario) {
      req.flash('error', 'Expiro el Token');
      res.redirect('/reestablecer');
      return next();
  }

  // hashear el password
  usuario.password = bcrypt.hashSync(req.body.password, bcrypt.genSaltSync(10) );
  usuario.token = null;
  usuario.expiracion =null;
  
  // guardar el password
  await usuario.save();
  req.flash('correcto', 'Password Actualizado');
  res.redirect('/iniciar-sesion');

}