var g_id_usuario = "";

function agregarUsuario(){
    var nombre_usuario = document.getElementById("txt_nombre_usuario").value;
    const myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");

    var fechaActual = obtenerFechaHora();

    const raw = JSON.stringify({
        "nombre_usuario": nombre_usuario,
        "fecha_registro": fechaActual
    });

    const requestOptions = {
        method: "POST",
        headers: myHeaders,
        body: raw,
        redirect: "follow"
    };

    fetch("http://144.126.210.74:8080/api/usuario", requestOptions)
        .then((response) => {
            if(response.status == 200) {
                location.href = "listar.html";
            }
        })
        .then((result) => console.log(result))
        .catch((error) => console.error(error));
}

function listarUsuarios(){
    const requestOptions = {
        method: "GET",
        redirect: "follow"
    };

    fetch("http://144.126.210.74:8080/api/usuario?_size=200", requestOptions)
        .then((response) => response.json())
        .then((json) => {
            json.forEach(completarFila);
            $('#tbl_usuario').DataTable();
        })
        .then((result) => console.log(result))
        .catch((error) => console.error(error));
}

function completarFila(element, index, arr){
    var fechaFormateada = formatearFechaHora(element.fecha_registro);
    arr[index] = document.querySelector("#tbl_usuario tbody").innerHTML += 
    `<tr>
        <td>${element.id_usuario}</td>
        <td>${element.nombre_usuario}</td>
        <td>${fechaFormateada}</td>
        <td>
            <a href='actualizar.html?id=${element.id_usuario}' class='btn btn-warning btn-sm'>Actualizar</a>
            <a href='eliminar.html?id=${element.id_usuario}' class='btn btn-danger btn-sm'>Eliminar</a> 
        </td>
    </tr>`;
}

function obtenerIdActualizacion(){
    const queryString = window.location.search;
    const parametros = new URLSearchParams(queryString);
    const p_id_usuario = parametros.get('id');
    g_id_usuario = p_id_usuario;

    obtenerDatosActualizacion(p_id_usuario);
}

function obtenerIdEliminacion(){
    const queryString = window.location.search;
    const parametros = new URLSearchParams(queryString);
    const p_id_usuario = parametros.get('id');
    g_id_usuario = p_id_usuario;

    obtenerDatosEliminacion(p_id_usuario);
}

function obtenerDatosEliminacion(id_usuario) {
    const requestOptions = {
        method: "GET",
        redirect: "follow"
    };

    fetch("http://144.126.210.74:8080/api/usuario/"+id_usuario, requestOptions)
        .then((response) => response.json())
        .then((json) => json.forEach(completarEtiquetaEliminar))
        .then((result) => console.log(result))
        .catch((error) => console.error(error));
}

function obtenerDatosActualizacion(id_usuario) {
    const requestOptions = {
        method: "GET",
        redirect: "follow"
    };

    fetch("http://144.126.210.74:8080/api/usuario/"+id_usuario, requestOptions)
        .then((response) => response.json())
        .then((json) => json.forEach(completarFormularioActualizar))
        .then((result) => console.log(result))
        .catch((error) => console.error(error));
}

function completarEtiquetaEliminar(element, index, arr){
    var nombreUsuario = element.nombre_usuario;
    document.getElementById('lbl_eliminar').innerHTML = "¿Desea eliminar este usuario? <b>" + nombreUsuario + "</b>";
}

function completarFormularioActualizar(element, index, arr){
    var nombreUsuario = element.nombre_usuario;
    document.getElementById('txt_nombre_usuario').value = nombreUsuario;
}

function actualizarUsuario(){
    var nombre_usuario = document.getElementById("txt_nombre_usuario").value;
    const myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");

    const raw = JSON.stringify({
        "nombre_usuario": nombre_usuario
    });

    const requestOptions = {
        method: "PATCH",
        headers: myHeaders,
        body: raw,
        redirect: "follow"
    };

    fetch("http://144.126.210.74:8080/api/usuario/"+g_id_usuario, requestOptions)
        .then((response) => {
            if(response.status == 200) {
                location.href = "listar.html";
            }
        })
        .then((result) => console.log(result))
        .catch((error) => console.error(error));
}

function eliminarUsuario(){
    const myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");

    const requestOptions = {
        method: "DELETE",
        headers: myHeaders,
        redirect: "follow"
    };

    fetch("http://144.126.210.74:8080/api/usuario/"+g_id_usuario, requestOptions)
        .then((response) => {
            if(response.status == 200) {
                location.href = "listar.html";
            }
            if(response.status == 400){
                alert("No es posible eliminar. Registro está siendo utilizado.");
            }
        })
        .then((result) => console.log(result))
        .catch((error) => console.error(error));
}

function obtenerFechaHora(){
    var fechaHoraActual = new Date();
    var fechaFormateada = fechaHoraActual.toLocaleString('es-ES', {
        hour12: false,
        year: 'numeric',
        month: '2-digit', 
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit', 
        second: '2-digit'
    }).replace(/(\d+)\/(\d+)\/(\d+)\,\s*(\d+):(\d+):(\d+)/,'$3-$2-$1 $4:$5:$6');
    return fechaFormateada;
}

function formatearFechaHora(fecha_registro){
    var fechaHoraActual = new Date(fecha_registro);
    var fechaFormateada = fechaHoraActual.toLocaleString('es-ES', {
        hour12: false,
        year: 'numeric',
        month: '2-digit', 
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit', 
        second: '2-digit',
        timeZone: 'UTC'
    }).replace(/(\d+)\/(\d+)\/(\d+)\,\s*(\d+):(\d+):(\d+)/,'$3-$2-$1 $4:$5');

    return fechaFormateada;
}
