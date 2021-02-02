import axios from "axios";
import Swal  from 'sweetalert2';

import {actualizarAvance}   from '../funciones/avance';

const tareas = document.querySelector('.listado-pendientes');

if (tareas) {
    tareas.addEventListener('click', (e) => {
        // modificar tareas
        if (e.target.classList.contains('fa-check-circle')) {
            const icono   = e.target;
            const idTarea = icono.parentElement.parentElement; // para llegar al data-tarea  y sacar el ID
            const id_Tarea= idTarea.dataset.tarea;

            // request hacia /tareas/:id
            const url = `${location.origin}/tareas/${id_Tarea}`;
            
            // llama a la url con el patch
            axios.patch(url, { id_Tarea })
                .then(function(respuesta){
                    if (respuesta.status === 200) {
                        icono.classList.toggle('completo');  // toggle completo se lo pone o quita el color

                        actualizarAvance();
                    }
                })

        }
        // eliminar Tarea
        if (e.target.classList.contains('fa-trash')) {
             // para llegar al data-tarea  y sacar el ID
            const tareaHTML = e.target.parentElement.parentElement,
                  idTarea   = tareaHTML.dataset.tarea;

            Swal.fire({
            title: 'Deseas Borrar esta Tarea ?',
            text: "NO se podra recuperar la Tarea ...!",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Si, Borrar',
            cancelButtonText:  'No, Cancelar'
            }).then((result) => {
                if (result.value) {
                    // enviar peticion de borrar por axios de formato API
                    const url = `${location.origin}/tareas/${idTarea}`;
                    axios.delete(url, {params: {idTarea}})
                    .then(function(respuesta){
                        if (respuesta.status === 200) {

                            // eliminar el NODO
                            tareaHTML.parentElement.removeChild(tareaHTML);

                            // alerta
                            Swal.fire(
                                'Tarea Eliminada',
                                respuesta.data,
                                'success'
                            )

                            actualizarAvance();
                        }
                    })
                }
            })

        }

    });
    
}

export default tareas;