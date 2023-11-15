// index.js

const express = require('express');
const jwt = require('jsonwebtoken');

const app = express();
const PORT = 3000;

const secretKey = 'tuclavesecreta'; // Cambia esto en un entorno de producción


app.use(express.json());

app.get('/', (req, res) => {
  res.send('¡Practicando JWT!');
});

app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});



app.post('/login', (req, res) => {
  // Aquí normalmente verificarías las credenciales del usuario
  // En este ejemplo, asumimos que el usuario se autentica correctamente

  const usuario = {
    id: 1,
    nombre: 'UsuarioEjemplo',
  };

  jwt.sign({ usuario }, secretKey, { expiresIn: '1h' }, (err, token) => {
    if (err) {
      res.status(500).json({ error: 'Error al generar el token' });
    } else {
      res.json({ token });
    }
  });
});


const verificarToken = (req, res, next) => {
    const token = req.header('Authorization');
  
    if (!token) {
      return res.status(401).json({ error: 'Acceso denegado. Token no proporcionado.' });
    }
  
    jwt.verify(token, secretKey, (err, decoded) => {
      if (err) {
        return res.status(403).json({ error: 'Acceso denegado. Token inválido.' });
      }
  
      req.usuario = decoded.usuario;
      next();
    });
  };
  
  app.get('/recurso-protegido', verificarToken, (req, res) => {
    res.json({ mensaje: 'Este es un recurso protegido.', usuario: req.usuario });
  });


  //>curl -X POST http://localhost:3000/login H Content-Type: application/json -d {"usuario": "ejemplo", "contrasena": "123456"}
  //{"token":"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c3VhcmlvIjp7ImlkIjoxLCJub21icmUiOiJVc3VhcmlvRWplbXBsbyJ9LCJpYXQiOjE2OTk5MzI4NTMsImV4cCI6MTY5OTkzNjQ1M30.SVCqKJXUBFiJ7Dffbgz8Skg3ZOE6f6GdWl2P02VvP4A"}

  //curl http://localhost:3000/recurso-protegido -H "Authorization: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c3VhcmlvIjp7ImlkIjoxLCJub21icmUiOiJVc3VhcmlvRWplbXBsbyJ9LCJpYXQiOjE2OTk5MzI4NTMsImV4cCI6MTY5OTkzNjQ1M30.SVCqKJXUBFiJ7Dffbgz8Skg3ZOE6f6GdWl2P02VvP4A"
