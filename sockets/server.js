
const express = require('express');
const { createServer } = require('node:http');

const app = express();
const server = createServer(app);

const socketio = require('socket.io');
const io = socketio(server);

server.listen(3000 , () => { 
    console.log('Servidor corriendo en http://localhost:3000'); 
})  

//endpoints
//app.get('/', (req, res) => { res.send('¡Practicando SocketIO!');  });

app.use(express.static('public'))


let UserOnId = []
let IdsOnUser = []

io.on('connection', (socket) => {
    console.log('Un cliente se ha conectado' + socket.id);

    
    socket.on('disconnect', () => {
        console.log('Un cliente se ha desconectado' + socket.id);
        let id_user = socket.id;
        if(UserOnId[id_user]){
            let usuario = UserOnId[id_user];

            delete UserOnId[id_user];
    
            let ids = IdsOnUser[usuario];
            let idBorrar;
            for (let i = 0; i < ids.length; i++) {
                if(id_user == ids[i]){
                    idBorrar = i;
                }
            }
            
            IdsOnUser[usuario].splice(idBorrar, 1);
            if(IdsOnUser[usuario].length == 0){
                delete IdsOnUser[usuario];
            }
        }
    });


    socket.on('datos_usuarios', (datos) => {
        let usuario = datos.usuario;
        let id_socket = socket.id;

        UserOnId[id_socket] = usuario;
        if(IdsOnUser[usuario] == null){
            IdsOnUser[usuario] = [];
        }
        IdsOnUser[usuario].push(id_socket);
        
        console.log('correo ' + datos.correo + ' usuario ' + datos.usuario + ' id ' + id_usuario);
        io.emit('nuevo_usuario', {user: datos.usuario})
    });

    socket.on('send_message', (datos) => {

        console.log('mensaje ' + datos.mensaje);
        io.to(id_socket).emit('nuevo_mensaje', {user: datos.usuario ,mensaje: datos.mensaje})
    });
    //io.emit('evento2', 'datos' );

});



