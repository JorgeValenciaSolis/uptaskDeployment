import Swal from 'sweetalert2';
import axions from 'axios';

const btnEliminar = document.querySelector('#eliminar-proyecto');

// si el boton eliminar existe en la pagina 
if (btnEliminar) {
    btnEliminar.addEventListener('click', e => {
        const urlProyecto = e.target.dataset.proyectoUrl;
        // console.log(urlProyecto);
        
        Swal.fire({
            title: 'Deseas Borrar el Protecto ?',
            text: "NO se podra recuperar el Proyecto...!",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Si, Borrar',
            cancelButtonText:  'No, Cancelar'
          }).then((result) => {
            if (result.isConfirmed) {
              // enviar peticion en axios de formato API
              const url = `${location.origin}/proyectos/${urlProyecto}`;
              // enviar la peticion
              axions.delete(url, {params: {urlProyecto} })
                .then(function(respuesta){
                    console.log(respuesta)
                    Swal.fire(
                        'Proyecto Eliminado',
                        respuesta.data,     // Respuesta desde el Controlador
                        'success'
                      );
                      // redireccionar al inicio
                      setTimeout(() => {
                          window.location.href = '/'
                      }, 3000);
                })
                .catch(() => {
                    Swal.fire({
                      type: 'error',
                      title: 'Hubo un error',
                      text: 'No se pudo eliminar el Proyecto'
                    })
                })
            }
          })
        })
}

export default btnEliminar;

