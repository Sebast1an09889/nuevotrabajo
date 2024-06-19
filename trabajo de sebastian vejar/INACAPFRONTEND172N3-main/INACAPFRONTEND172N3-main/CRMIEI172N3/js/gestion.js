var g_id_gestion = "";

function agregarGestion() {
    var id_usuario = document.getElementById("sel_id_usuario").value;
    var id_cliente = document.getElementById("sel_id_cliente").value;
    var id_tipo_gestion = document.getElementById("sel_id_tipo_gestion").value;
    var id_resultado = document.getElementById("sel_id_resultado").value;
    var comentarios = document.getElementById("txt_comentarios").value;

    const myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");

    const raw = JSON.stringify({
        "id_usuario": id_usuario,
        "id_cliente": id_cliente,
        "id_tipo_gestion": id_tipo_gestion,
        "id_resultado": id_resultado,
        "comentarios": comentarios,
        "fecha_registro": "2024-06-04 17:29:00"
    });

    const requestOptions = {
        method: "POST",
        headers: myHeaders,
        body: raw,
        redirect: "follow"
    };

    fetch("http://144.126.210.74:8080/api/gestion", requestOptions)
        .then((response) => {
            if (response.status == 200) {
                location.href = "listar.html";
            }
            if (response.status == 400) {
                alert("Se ha producido un error al agregar");
            }
        })
        .then((result) => console.log(result))
        .catch((error) => console.error(error));
}

function listarGestion() {
    var myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");
    var raw = JSON.stringify({
        "query": "select ges.id_gestion as id_gestion, cli.id_cliente, ges.comentarios as comentarios, CONCAT(cli.nombres, ' ', cli.apellidos) as nombre_cliente, CONCAT(usu.nombres, ' ', usu.apellidos) as nombre_usuario, tge.nombre_tipo_gestion as nombre_tipo_gestion, res.nombre_resultado as nombre_resultado, ges.fecha_registro as fecha_registro from gestion ges, usuario usu, cliente cli, tipo_gestion tge, resultado res where ges.id_usuario = usu.id_usuario and ges.id_cliente = cli.id_cliente and ges.id_tipo_gestion = tge.id_tipo_gestion and ges.id_resultado = res.id_resultado"
    });
    var requestOptions = {
        method: 'POST',
        headers: myHeaders,
        body: raw,
        redirect: 'follow'
    };
    fetch("http://144.126.210.74:8080/dynamic", requestOptions)
        .then(response => response.json())
        .then((json) => {
            json.forEach(completarFila);
            $('#tbl_gestion').DataTable();
        })
        .then(result => console.log(result))
        .catch(error => console.log('error', error));
}

function completarFila(element, index, arr) {
    arr[index] = document.querySelector("#tbl_gestion tbody").innerHTML +=
        `<tr>
            <td>${element.id_gestion}</td>
            <td>${element.nombre_cliente}</td>
            <td>${element.nombre_usuario}</td>
            <td>${element.nombre_tipo_gestion}</td>
            <td>${element.nombre_resultado}</td>
            <td>${element.comentarios}</td>
            <td>${element.fecha_registro}</td>
            <td>
                <a href='actualizar.html?id=${element.id_gestion}' class='btn btn-warning btn-sm'>Actualizar</a>
                <a href='eliminar.html?id=${element.id_gestion}' class='btn btn-danger btn-sm'>Eliminar</a>
            </td>
        </tr>`;
}

function obtenerIdActualizacion() {
    const queryString = window.location.search;
    const parametros = new URLSearchParams(queryString);
    const p_id_gestion = parametros.get('id');
    g_id_gestion = p_id_gestion;

    obtenerDatosActualizacion(p_id_gestion);
}

function obtenerIdEliminacion() {
    const queryString = window.location.search;
    const parametros = new URLSearchParams(queryString);
    const p_id_gestion = parametros.get('id');
    g_id_gestion = p_id_gestion;

    obtenerDatosEliminacion(p_id_gestion);
}

function obtenerDatosEliminacion(id_gestion) {
    const requestOptions = {
        method: "GET",
        redirect: "follow"
    };

    fetch("http://144.126.210.74:8080/api/gestion/" + id_gestion, requestOptions)
        .then((response) => response.json())
        .then((json) => json.forEach(completarEtiquetaEliminar))
        .then((result) => console.log(result))
        .catch((error) => console.error(error));
}

function obtenerDatosActualizacion(id_gestion) {
    const requestOptions = {
        method: "GET",
        redirect: "follow"
    };

    fetch("http://144.126.210.74:8080/api/gestion/" + id_gestion, requestOptions)
        .then((response) => response.json())
        .then((json) => json.forEach(completarFormularioActualizar))
        .then((result) => console.log(result))
        .catch((error) => console.error(error));
}

function completarEtiquetaEliminar(element, index, arr) {
    var nombreTipoGestion = element.nombre_tipo_gestion;
    document.getElementById('lbl_eliminar').innerHTML = "¿Desea eliminar esta gestión? <b>" + nombreTipoGestion + "</b>";
}

function completarFormularioActualizar(element, index, arr) {
    var nombreTipoGestion = element.nombre_tipo_gestion;
    document.getElementById('txt_nombre_tipo_gestion').value = nombreTipoGestion;
}

function actualizarGestion() {
    var nombre_tipo_gestion = document.getElementById("txt_nombre_tipo_gestion").value;
    const myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");

    const raw = JSON.stringify({
        "nombre_tipo_gestion": nombre_tipo_gestion
    });

    const requestOptions = {
        method: "PATCH",
        headers: myHeaders,
        body: raw,
        redirect: "follow"
    };

    fetch("http://144.126.210.74:8080/api/gestion/" + g_id_gestion, requestOptions)
        .then((response) => {
            if (response.status == 200) {
                location.href = "listar.html";
            }
        })
        .then((result) => console.log(result))
        .catch((error) => console.error(error));
}

function eliminarGestion() {
    const myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");

    const requestOptions = {
        method: "DELETE",
        headers: myHeaders,
        redirect: "follow"
    };

    fetch("http://144.126.210.74:8080/api/gestion/" + g_id_gestion, requestOptions)
        .then((response) => {
            if (response.status == 200) {
                location.href = "listar.html";
            }
            if (response.status == 400) {
                alert("No es posible eliminar. Registro está siendo utilizado.");
            }
        })
        .then((result) => console.log(result))
        .catch((error) => console.error(error));
}

function cargarListasDesplegables() {
    cargarSelectResultado();
    cargarSelectCliente();
    cargarSelectUsuario();
    cargarSelectTipoGestion();
}

function cargarSelectResultado() {
    const requestOptions = {
        method: "GET",
        redirect: "follow"
    };

    fetch("http://144.126.210.74:8080/api/resultado?_size=200", requestOptions)
        .then((response) => response.json())
        .then((json) => {
            json.forEach(completarOptionResultado);
        })
        .then((result) => console.log(result))
        .catch((error) => console.error(error));
}

function completarOptionResultado(element, index, arr) {
    arr[index] = document.querySelector("#sel_id_resultado").innerHTML +=
        `<option value='${element.id_resultado}'> ${element.nombre_resultado} </option>`;
}

function cargarSelectCliente() {
    const requestOptions = {
        method: "GET",
        redirect: "follow"
    };

    fetch("http://144.126.210.74:8080/api/cliente?_size=200", requestOptions)
        .then((response) => response.json())
        .then((json) => {
            json.forEach(completarOptionCliente);
        })
        .then((result) => console.log(result))
        .catch((error) => console.error(error));
}

function completarOptionCliente(element, index, arr) {
    arr[index] = document.querySelector("#sel_id_cliente").innerHTML +=
        `<option value='${element.id_cliente}'> ${element.apellidos} ${element.nombres} </option>`;
}

function cargarSelectUsuario() {
    const requestOptions = {
        method: "GET",
        redirect: "follow"
    };

    fetch("http://144.126.210.74:8080/api/usuario?_size=200", requestOptions)
        .then((response) => response.json())
        .then((json) => {
            json.forEach(completarOptionUsuario);
        })
        .then((result) => console.log(result))
        .catch((error) => console.error(error));
}

function completarOptionUsuario(element, index, arr) {
    arr[index] = document.querySelector("#sel_id_usuario").innerHTML +=
        `<option value='${element.id_usuario}'> ${element.apellidos} ${element.nombres} </option>`;
}

function cargarSelectTipoGestion() {
    const requestOptions = {
        method: "GET",
        redirect: "follow"
    };

    fetch("http://144.126.210.74:8080/api/tipo_gestion?_size=200", requestOptions)
        .then((response) => response.json())
        .then((json) => {
            json.forEach(completarOptionTipoGestion);
        })
        .then((result) => console.log(result))
        .catch((error) => console.error(error));
}

function completarOptionTipoGestion(element, index, arr) {
    arr[index] = document.querySelector("#sel_id_tipo_gestion").innerHTML +=
        `<option value='${element.id_tipo_gestion}'> ${element.nombre_tipo_gestion} </option>`;
}

function formatearFechaHora(fecha_registro) {
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
    }).replace(/(\d+)\/(\d+)\/(\d+)\,\s*(\d+):(\d+):(\d+)/, '$3-$2-$1 $4:$5');

    return fechaFormateada;
}
