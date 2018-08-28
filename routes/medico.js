const express = require('express');
const mdAutenticacion = require('../middlewares/autenticacion');

const app = express();
const Medico = require('../models/medico');
const Hospital = require('../models/hospital');


// ==========================================
// Obtener todos los medicos
// ==========================================
app.get('/', (req, res) => {
  let desde = req.query.desde || 0;
  desde = Number(desde);

  Medico.find({})
    .skip(desde)
    .limit(5)
    .populate('usuario', 'nombre email')
    .populate('hospital')
    .exec((err, medicos) => {
      if (err) {
        return res.status(500).json({
          ok: false,
          mensaje: 'Error cargando medico',
          errors: err,
        });
      }
      
      Medico.count({}, (err, conteo) => {
        res.status(200).json({
          ok: true,
          medicos,
          total: conteo,
        });
      });
    });
});

// ==========================================
// Crear un medico
// ==========================================
app.post('/', mdAutenticacion.verificaToken, (req, res) => {
  const body = req.body;

  const medico = new Medico({
    nombre: body.nombre,
    img: body.img,
    hospital: body.hospital,
    usuario: req.usuario,
  });

  medico.save((err, medicoGuardado) => {
    if (err) {
      return res.status(400).json({
        ok: false,
        mensaje: 'Error al guardar medico',
        errors: err,
      });
    }
    
    res.status(200).json({
      ok: true,
      medico: medicoGuardado,
    });
  });
});

// ==========================================
// Actualiza un medico
// ==========================================
app.put('/:id', mdAutenticacion.verificaToken, (req, res) => {
  const id = req.params.id;
  const body = req.body;

  Medico.findById(id, (err, medico) => {
    if (err) {
      return res.status(500).json({
        ok: false,
        mensaje: 'Error al buscar medico',
        errors: err,
      });
    }

    if (!medico) {
      return res.status(400).json({
        ok: false,
        mensaje: 'El medico con el id ' + id + ' no existe',
        errors: { message: 'No existe un medico con ese ID' }
      });
    }

    medico.nombre = body.nombre;
    medico.img = body.img;
    medico.hospital = body.hospital,
    medico.usuario = req.usuario;

    medico.save((err, medicoGuardado) => {
      if (err) {
        return res.status(400).json({
          ok: false,
          mensaje: 'Error al actualizar medico',
          errors: err,
        });
      }

      res.status(200).json({
        ok: true,
        medico: medicoGuardado,
      });
    });
  });
});

// ==========================================
// Eliminar un medico por el Id
// ==========================================
app.delete('/:id', mdAutenticacion.verificaToken, (req, res) => {
  const id = req.params.id;

  Medico.findByIdAndRemove(id, (err, hospitalBorrado) => {
    if (err) {
      return res.status(500).json({
        ok: false,
        mensaje: 'Error al buscar medico',
        errors: err,
      });
    }

    if (!hospitalBorrado) {
      return res.status(400).json({
        ok: false,
        mensaje: 'El medico con el id ' + id + ' no existe',
        errors: { message: 'No existe un medico con ese ID' }
      });
    }
    res.status(200).json({
      ok: true,
      medico: hospitalBorrado,
    });
  });
});

module.exports = app;