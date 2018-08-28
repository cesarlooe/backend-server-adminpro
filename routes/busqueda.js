const express = require('express');

const app = express();

const Hospital = require('../models/hospital');
const Medico = require('../models/medico');
const Usuario = require('../models/usuario');

app.get('/todo/:busqueda', (req, res, next) => {

  const busqueda = req.params.busqueda;
  const regex = new RegExp(busqueda, 'i');

  Promise.all([
    buscarHospitales(regex),
    buscarMedicos(regex),
    buscarUsuario(regex),
  ]).then((respuestas) => {
    res.status(200).json({
      ok: true,
      hospitales: respuestas[0],
      medicos: respuestas[1],
      usuarios: respuestas[2],
    });
  });
});

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

const buscarUsuario = (regex) => {
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


module.exports = app;