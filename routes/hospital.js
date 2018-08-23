const express = require('express');
const mdAutenticacion = require('../middlewares/autenticacion');

const app = express();
const Hospital = require('../models/hospital');


// ==========================================
// Obtener todos los hospitales
// ==========================================
app.get('/', (req, res) => {
  Hospital.find({}, (err, hospitales) => {
    if (err) {
      return res.status(500).json({
        ok: false,
        mensaje: 'Error cargando hospital',
        errors: err,
      });
    }
    res.status(200).json({
      ok: true,
      hospitales,
    });
  });
});

// ==========================================
// Crear un hospital
// ==========================================
app.post('/', mdAutenticacion.verificaToken, (req, res) => {
  const body = req.body;

  const hospital = new Hospital({
    nombre: body.nombre,
    img: body.img,
    usuario: body.usuario,
  });

  hospital.save((err, hospitalGuardado) => {
    if (err) {
      return res.status(400).json({
        ok: false,
        mensaje: 'Error al guardar hospital',
        errors: err,
      });
    }
    
    res.status(200).json({
      ok: true,
      hospital: hospital,
    });
  });
});

// ==========================================
// Actualiza un hospital
// ==========================================
app.put('/:id', mdAutenticacion.verificaToken, (req, res) => {
  const id = req.params.id;
  const body = req.body;

  Hospital.findById(id, (err, hospital) => {
    if (err) {
      return res.status(500).json({
        ok: false,
        mensaje: 'Error al buscar hospital',
        errors: err,
      });
    }

    if (!hospital) {
      return res.status(400).json({
        ok: false,
        mensaje: 'El hospital con el id ' + id + ' no existe',
        errors: { message: 'No existe un hospital con ese ID' }
      });
    }

    hospital.nombre = body.nombre;
    hospital.img = body.img;
    hospital.usuario = req.usuario;

    hospital.save((err, hospitalGuardado) => {
      if (err) {
        return res.status(400).json({
          ok: false,
          mensaje: 'Error al actualizar hospital',
          errors: err,
        });
      }

      res.status(200).json({
        ok: true,
        hospital: hospitalGuardado,
      });
    })
  });
});

// ==========================================
// Eliminar un hospital por el Id
// ==========================================
app.delete('/:id', mdAutenticacion.verificaToken, (req, res) => {
  const id = req.params.id;
  const body = req.body;

  Hospital.findByIdAndRemove(id, (err, hospitalBorrado) => {
    if (err) {
      return res.status(500).json({
        ok: false,
        mensaje: 'Error al buscar hospital',
        errors: err,
      });
    }

    if (!hospitalBorrado) {
      return res.status(400).json({
        ok: false,
        mensaje: 'El hospital con el id ' + id + ' no existe',
        errors: { message: 'No existe un hospital con ese ID' }
      });
    }
    res.status(200).json({
      ok: true,
      hospital: hospitalBorrado,
    });
  });
});

module.exports = app;