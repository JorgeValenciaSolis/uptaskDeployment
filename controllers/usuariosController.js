// importar el modelo
const  Usuarios = require('../models/Usuarios');
const  enviarEmail = require('../handlers/email');

exports.formCrearCuenta = (req, res) =>{
    res.render('crearCuenta', {
        nombrePagina : 'Crear Cuenta en Uptask'
    });

}

exports.formIniciarSesion = (req, res) =>{
    // ver en la consola los errores de Flash y passport
    // console.log(res.locals.mensajes);

    const {error} = res.locals.mensajes;

    res.render('IniciarSesion', {
        nombrePagina : 'Iniciar Sesion en Uptask',
        error: error
    });

}

exports.crearCuenta = async (req, res) =>{
     // leer los datos
    const { email, password} = req.body;

     // vamos a cachar los errores para mostrar las alertas
    try {
        // crear el usuario
        await Usuarios.create({
            email,
            password
        });
        // crear una URL de confirmar
        const confirmarUrl = `http://${req.headers.host}/confirmar/${email}`;
        console.log (confirmarUrl);
        // crear el objeto de Usuario
        const usuario ={
            email
        };
        console.log (usuario);
        // enviar email
        await enviarEmail.enviar({
            usuario, 
            subject : 'Confirma tu cuenta Uptask',
            confirmarUrl, 
            archivo : 'confirmar-cuenta'
        }); 
        req.flash('correcto', 'Enviamos un correo a tu mail confirma tu cuenta');
        res.redirect('/iniciar-sesion');
    } catch (error) {
        //  agrupar todos los errores en el objeto error com map()
        req.flash('error', error.errors.map(error => error.message));  

        // llamamos a la misma vista, le pasamos el objeto de los errores en mensajes: usando request flash
        res.render('crearCuenta', {
            mensajes: req.flash(),
            nombrePagina : 'Crear Cuenta en Uptask',
            email: email,
            password             // en java script si la variable y el valor se llama igual se pasa uno solo
        });
    
    }

}
// llama a la vista pas restablecer el Password
exports.formRestablecerPassword=(req, res, next) => {
    res.render('reestablecer', {
        nombrePagina: 'Reestablecer tu Contraseña'
    });
}

// para confirmar la cuenta nueva por medio del email
exports.confirmarCuenta = async (req, res, next) =>{
    const usuario = await Usuarios.findOne({
        where: {
            email: req.params.correo
        }
    });

    // si no existe el usuario
    if (!usuario) {
        req.flash('error', 'No existe el email');
        res.redirect('/crear-cuenta');
        return next();
    };

    usuario.activo = 1;

    await usuario.save();

    req.flash('correcto', 'Cuenta Activada');
    res.redirect('/iniciar-sesion');
}