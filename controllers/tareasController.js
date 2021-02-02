// EL CONTROLLER  iterectua con  la bd (modelo) y manda la informacion a las vistas (views )

// importar el modelo de la BD con la conexion
const Proyectos = require('../models/Proyectos');
const Tareas    = require('../models/Tareas');


exports.agregarTarea = async (req, res, next)=> {
    // Obtenemos el Proyhecto Actual
    const proyecto = await Proyectos.findOne({where: { url: req.params.url }});
    //console.log(proyecto);
    //console.log(req.body);

    // leer el valor del input de tareas.pug input name tarea
    const {tarea}    =  req.body;
    // definir estado y ID proyecto
    const estado     = 0;
    const proyectoId = proyecto.id  // el nombre para que se mapee tiene que ser como el de la columna en tableplus
   
    // Insertar en la base de Datos
    const resultado =  await Tareas.create({ tarea, estado, proyectoId});

    if (!resultado) {
        return next();
    }

    // redireccionar
    res.redirect(`/proyectos/${req.params.url}`);
}

exports.cambiarEstadoTarea = async (req, res)=> {
    // patch funciona com params no con query
    const { id } = req.params;
    const tarea  = await Tareas.findOne({ where: {id: id} });

    // console.log(tarea);
    // res.send('cambiar edo...');

    // cambiar el estado de la tarea
    let estado = 0;
    if (tarea.estado === estado) {
        estado = 1;
    }
    tarea.estado = estado;
    const resultado = await tarea.save();    // Lo guarda en la base de Datos; metodo de sequelize

    if (!resultado) return next();

    res.status(200).send('Actualizado');

}

exports.eliminarTarea = async (req, res)=> {
    const { id } = req.params;

    // Eliminar la Tarea
    const resultado = await Tareas.destroy({where: { id }});

    if (!resultado) return next();

    res.status(200).send('Se Borrro Correctamente');

} 