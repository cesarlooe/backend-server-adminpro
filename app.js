// Requires
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors')

// Inicializar variables
const app = express();

// Habilitar cors
const corsOptions = {
  origin: 'http://localhost:4200',
  optionsSuccessStatus: 200 // some legacy browsers (IE11, various SmartTVs) choke on 204
}
app.use(cors(corsOptions));

// Body Parser
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// Serve Index Config
// const serveIndex = require('serve-index');
// app.use(express.static(__dirname + '/'))
// app.use('/uploads', serveIndex(__dirname + '/uploads'));

// Importar rutas
const appRoutes = require('./routes/app');
const loginRoutes = require('./routes/login');
const usuarioRoutes = require('./routes/usuario');
const hospitalRoutes = require('./routes/hospital');
const medicoRoutes = require('./routes/medico');
const busquedaRoutes = require('./routes/busqueda');
const uploadRoutes = require('./routes/upload');
const imagenesRoutes = require('./routes/imagenes');

// Conexión a la Base de Datos
mongoose.connect('mongodb://localhost:27017/hospitalDB', { useNewUrlParser: true }, (err, res) => {
    if (err) throw err;
    console.log('Base de Datos: \x1b[32m%s\x1b[0m', 'online');
});

// Rutas
app.use('/login', loginRoutes);
app.use('/usuario', usuarioRoutes);
app.use('/hospital', hospitalRoutes);
app.use('/medico', medicoRoutes);
app.use('/busqueda', busquedaRoutes);
app.use('/upload', uploadRoutes);
app.use('/img', imagenesRoutes);
app.use('/', appRoutes);

// Escuchar peticiones
app.listen(3000, () => {
    console.log('Express server puerto 3000: \x1b[32m%s\x1b[0m', 'online');
});