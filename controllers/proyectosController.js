// EL CONTROLLER  iterectua con  la bd (modelo) y manda la informacion a las vistas (views )

// importar el modelo de la BD con la conexion
const Proyectos = require('../models/Proyectos');

// importar Tareas del modelo de la BD con la conexion
const Tareas    = require('../models/Tareas');

const { request } = require("express");

exports.proyectosHome = async (req, res)=> {
    
    //console.log(res.locals.usuario);

    // Trae el ID Usuaio
    const UsuarioId = res.locals.usuario.id;

    // Trae todo los proyectos de un Usuario de la tabla proyectos
    const proyectos = await Proyectos.findAll({where: {UsuarioId}});  

    res.render('index', {nombrePagina: 'Proyectos', proyectos });
}

exports.formularioProyecto = async (req, res)=> {
    // Trae el ID Usuaio
    const UsuarioId = res.locals.usuario.id;

    // Trae todo los proyectos de un Usuario de la tabla proyectos
    const proyectos = await Proyectos.findAll({where: {UsuarioId}});  

    res.render('nuevoProyecto', {nombrePagina: 'Nuevo Proyecto', proyectos});
}

exports.nuevoProyecto = async (req, res)=> {
     // Trae el ID Usuaio
     const UsuarioId = res.locals.usuario.id;

     // Trae todo los proyectos de un Usuario de la tabla proyectos
     const proyectos = await Proyectos.findAll({where: {UsuarioId}});  

    // Enviar a la consola lo q se escriba 
    //console.log(req.body);

    // validar que tengas algo en el input
    const { nombre } = req.body;

    let errores = [];
    if (!nombre) {
        errores.push({'texto': 'Agrega un Nombre al Proyecto'});
    }
    // si hay errores
    if (errores.length > 0) {
        res.render('nuevoProyecto', {nombrePagina : 'Nuevo Proyecto', errores, proyectos});
    } else {
        // NO hay errores Insertar en la BD
        // Trae el ID Usuaio
        const UsuarioId = res.locals.usuario.id;
        await Proyectos.create({ nombre,  UsuarioId });
        res.redirect('/');
    }
        
    
}

exports.proyectoPorUrl = async (req, res, next) => {
    // Trae el ID Usuaio
    const UsuarioId = res.locals.usuario.id;

    // Trae todo los proyectos de un Usuario de la tabla proyectos
    // Promise hace que se ejecute la busqueda findAll y findOne al mmismo tiempo
    const proyectosPromise = Proyectos.findAll({where: {UsuarioId}});  

    
     // Trae un proyectos de la tabla proyectos por id
     const proyectoPromise  = Proyectos.findOne({
         where: {
             url: req.params.url,
             UsuarioId
         }
     
    }); 
     // una consulta no de pende de la otra consulta por eso se hace Promise,  paralelas
     const [proyectos, proyecto] = await Promise.all([proyectosPromise, proyectoPromise]);

    // Consultar Tareas del Proyecto Actual
    const tareas = await Tareas.findAll({
        where: {
            proyectoId : proyecto.id
        },
        // inlcuyendo el objeto Proyecto es como un JOIN en SQL
        include: [                      
            { model: Proyectos }   
        ]
    });
        
    if (!proyecto) return next();  // si no hay proyecto se pasa al next midleware o no va hacer nada 
     
    // render a la vista
    res.render('tareas', {nombrePagina : 'Tareas del Proyecto', proyecto, proyectos, tareas});
}

exports.formularioEditar = async (req, res) => {
    // Trae el ID Usuaio
    const UsuarioId = res.locals.usuario.id;

    // Trae todo los proyectos de un Usuario de la tabla proyectos
    // Promise hace que se ejecute la busqueda findAll y findOne al mmismo tiempo
    const proyectosPromise = Proyectos.findAll({where: {UsuarioId}});  

    
     // Trae un proyectos de la tabla proyectos por id
     const proyectoPromise  = Proyectos.findOne({
         where: {
             url: req.params.url,
             UsuarioId
         }
    
    }); 
     // una consulta no de pende de la otra consulta por eso se hace Promise,  paralelas
     const [proyectos, proyecto] = await Promise.all([proyectosPromise, proyectoPromise]); 

    // render a la vista
    res.render('nuevoProyecto', {nombrePagina : 'Editar Proyecto', proyecto, proyectos});
}


exports.actualizarProyecto = async (req, res)=> {
    // Trae el ID Usuaio
    const UsuarioId = res.locals.usuario.id;

    // Trae todo los proyectos de un Usuario de la tabla proyectos
    const proyectos = await Proyectos.findAll({where: {UsuarioId}}); 

    // Enviar a la consola lo q se escriba 
    //console.log(req.body);

    // validar que tengas algo en el input
    const { nombre } = req.body;

    let errores = [];
    if (!nombre) {
        errores.push({'texto': 'Agrega un Nombre al Proyecto'});
    }
    // si hay errores
    if (errores.length > 0) {
        res.render('actualizarProyecto', {nombrePagina : 'Actualizar Proyecto', errores, proyectos});
    } else {
        // NO hay errores Actualiza en la BD
        await Proyectos.update(
            { nombre: nombre },
            { where: {id: req.params.id} }
        );
        res.redirect('/');
    }
        
    
}

exports.eliminarProyecto = async (req, res, next)=> {
    // req es la informacion que envias al servidor ya sea por params o query
    //console.log(req.query);
    const {urlProyecto} = req.query;
    // destroy es el delete de SQL
    const resultado = await Proyectos.destroy({
        where: {
            url : urlProyecto
        }
    });

    // si hubo un error

    if (!resultado) {
        return next();   // next() procesa el siguiente bloque o midleware
    }

    // Madando una respuesta al axion dentro del Sweet Alert
    res.status(200).send('Proyecto Eliminado... Correctamente');
}

