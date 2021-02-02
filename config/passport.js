const passport      = require('passport');
const LocalStrategy = require('passport-local').Strategy;

//Hacer Referencia al Modelo donde vamos autentificar

const Usuarios = require('../models/Usuarios');

// Local Strategy -- Login con credenciales propias ( usuario / password)
passport.use(
    new LocalStrategy(
        // Por Default passport espera un usuario y password --> debe ser como esta en el modelo Usuarios.js
        // definir los campos de autentificacion
        {
            usernameField: 'email',
            passwordField: 'password'
        },
        async (email, password, done) =>{
            try {
                const usuario = await Usuarios.findOne({
                    where: { 
                        email,
                        activo: 1
                    }
                });
                // Usuario EXISTE password incorrecto
                if (!usuario.verficarPassword(password)) {
                    return done(null, false, {
                        message : 'Password INCORRECTO'
                    })
                }
                // EL Email existe y el password es correcto
                return done(null, usuario);
            } catch (error) {
                // Usuario NO EXISTE
                return done(null, false, {
                    message : 'Cuenta NO EXISTE'
                })
            }
        }
    )
);

// Serializar el Usuario
passport.serializeUser((usuario, callback) =>{
    callback(null, usuario);
})

// Deserealizar el Usuario
passport.deserializeUser((usuario, callback) =>{
    callback(null, usuario);
});

// Exportar toda la instancia de passport
module.exports = passport;


