const express = require('express');

const app = express();

const Hospital = require('../models/hospital');
const Medico = require('../models/medico');
const Usuario = require('../models/usuario');

// ==========================================
// Funciones
// ==========================================

const buscarHospitales = (regex) => {
  return new Promise((resolve, reject) => {
    Hospital.find({ nombre: regex })
      .populate('usuario', 'nombre email')
      .exec((err, hospitales) => {
        if (err) {
          reject('Error al cargar hospitales ', err);
        } else {
          resolve(hospitales);
        }
    });
  });
};

const buscarMedicos = (regex) => {
  return new Promise((resolve, reject) => {
    Medico.find({ nombre: regex })
      .populate('usuario', 'nombre email')
      .populate('hospital')
      .exec((err, medicos) => {
        if (err) {
          reject('Error al cargar medico ', err);
        } else {
          resolve(medicos);
        }
    });
  });
};

const buscarUsuarios = (regex) => {
  return new Promise((resolve, reject) => {
    Usuario.find({}, 'nombre email role')
      .or([{ nombre: regex }, { email: regex }])
      .exec((err, usuarios) => {
        if (err) {
          reject('Error al cargar usuarios ', err);
        } else {
          resolve(usuarios);
        }
      });
  });
};

// ==========================================
// Búsqueda por colección
// ==========================================

app.get('/coleccion/:tabla/:busqueda', (req, res, next) => {

  const tabla = req.params.tabla;
  const busqueda = req.params.busqueda;
  const regex = new RegExp(busqueda, 'i');

  let promesa;

  switch(tabla) {
    case 'usuarios':
      promesa = buscarUsuarios(regex);
      break;
    case 'medicos':
      promesa = buscarMedicos(regex);
      break;
    case 'hospitales':
      promesa = buscarHospitales(regex);
      break;
    default:
      return res.status(400).json({
        ok: false,
        mensaje: 'Los tipos de búsqueda son por usuarios, médicos y hospitales',
        error: { message: 'Collección no válida'}
      })
  }

  promesa.then((data) => {
    res.status(200).json({
      ok: true,
      [tabla]: data,
    });
  });
});

// ==========================================
// Búsqueda general
// ==========================================

app.get('/todo/:busqueda', (req, res, next) => {

  const busqueda = req.params.busqueda;
  const regex = new RegExp(busqueda, 'i');

  Promise.all([
    buscarHospitales(regex),
    buscarMedicos(regex),
    buscarUsuarios(regex),
  ]).then((respuestas) => {
    res.status(200).json({
      ok: true,
      hospitales: respuestas[0],
      medicos: respuestas[1],
      usuarios: respuestas[2],
    });
  });
});




module.exports = app;