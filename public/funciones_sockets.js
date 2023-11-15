const socket = io.connect();

socket.on('nuevo_usuario', (data) => {
    alert(data.user);
});

socket.on('nuevo_mensaje', (data) => {
    $('#container_mensajes').append('<p><strong>Usuario:'+ data.user +'</strong>'+ data.mensaje+'</p>');
});

function loguear(){
    let correo = $('#correo').val();
    let usuario = $('#usuario').val();

    let datos = {
        correo: correo,
        usuario: usuario
    }
    socket.emit('datos_usuarios', datos);
}

function enviarMensaje(){
    let mensaje = $('#mensaje').val();
    let usuario = $('#usuario').val();
    socket.emit('send_message', {mensaje, usuario});
}