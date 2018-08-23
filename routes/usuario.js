const express = require('express');
const bcrypt = require('bcryptjs');
const mdAutenticacion = require('../middlewares/autenticacion')

const app = express();

const Usuario = require('../models/usuario');

// ==========================================
// Obtener todos los usuarios
// ==========================================
app.get('/', (req, res) => {
  Usuario.find({}, 'nombre email img role')
    .exec(
      (err, usuarios) => {
        if (err) {
          return res.status(500).json({
            ok: false,
            mensaje: 'Error cargando usuario',
            errors: err
          });
        }
        res.status(200).json({
          ok: true,
          usuarios: usuarios,
        });
      });
});

// ==========================================
// Crear un nuevo usuario
// ==========================================
app.post('/', mdAutenticacion.verificaToken, (req, res) => {
  const body = req.body;

  const usuario = new Usuario({
    nombre: body.nombre,
    email: body.email,
    password: bcrypt.hashSync(body.password, 10),
    img: body.img,
    role: body.role
  });

  usuario.save((err, usuarioGuardado) => {
    if (err) {
      return res.status(400).json({
        ok: false,
        mensaje: 'Error al crear el usuario',
        errors: err
      });
    }
    res.status(201).json({
      ok: true,
      usuario: usuarioGuardado,
      usuariotoken: req.usuario
    });
  });
});

// ==========================================
// Actualizar usuario
// ==========================================
app.put('/:id', mdAutenticacion.verificaToken, (req, res) => {
  const id = req.params.id;
  const body = req.body;

  Usuario.findById(id, (err, usuario) => {
    if (err) {
      return res.status(500).json({
        ok: false,
        mensaje: 'Error al buscar usuario',
        errors: err
      });
    }

    if (!usuario) {
      return res.status(400).json({
        ok: false,
        mensaje: 'El usuario con el id ' + id + ' no existe',
        errors: { message: 'No existe un usuario con ese ID' }
      });
    }

    usuario.nombre = body.nombre;
    usuario.email = body.email;
    usuario.role = body.role;

    usuario.save((err, usuarioGuardado) => {
      if (err) {
        return res.status(400).json({
          ok: false,
          mensaje: 'Error al actualizar usuario',
          errors: err
        });
      }
      usuarioGuardado.password = ':)';
      res.status(200).json({
        ok: true,
        usuario: usuarioGuardado
      });
    });
  });
});


// ============================================
//   Eliminar un usuario por el Id
// ============================================
app.delete('/:id', mdAutenticacion.verificaToken, (req, res) => {
  const id = req.params.id;

  Usuario.findByIdAndRemove(id, (err, usuarioBorrado) => {

    if (err) {
      return res.status(500).json({
        ok: false,
        mensaje: 'Error al eliminar al usuario',
        errors: err
      });
    }

    if (!usuarioBorrado) {
      return res.status(400).json({
        ok: false,
        mensaje: 'No existe un usuario con ese id',
        errors: { message: 'No existe un usuario con ese id' }
      });
    }

    res.status(200).json({
      ok: true,
      usuario: usuarioBorrado
    });
  });
});


module.exports = app;