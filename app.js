// Requires
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');

// Inicializar variables
var app = express();

// Body Parser
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

// Importar rutas
const appRoutes = require('./routes/app');
const usuarioRoutes = require('./routes/usuario');
const hospitalRoutes = require('./routes/hospital');
const loginRoutes = require('./routes/login');

// Conexión a la Base de Datos
mongoose.connect('mongodb://localhost:27017/hospitalDB', { useNewUrlParser: true }, (err, res) => {
    if (err) throw err;
    console.log('Base de Datos: \x1b[32m%s\x1b[0m', 'online')
});

// Rutas
app.use('/usuario', usuarioRoutes);
app.use('/hospital', hospitalRoutes);
app.use('/login', loginRoutes);
app.use('/', appRoutes);

// Escuchar peticiones
app.listen(3000, () => {
    console.log('Express server puerto 3000: \x1b[32m%s\x1b[0m', 'online');
});