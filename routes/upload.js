const express = require('express');
const fileUpload = require('express-fileupload');
const fs = require('fs');

const app = express();

const Usuario = require('../models/usuario');
const Medico = require('../models/medico');
const Hospital = require('../models/hospital');

app.use(fileUpload());

app.put('/:tipo/:id', function(req, res) {
  
  const tipo = req.params.tipo;
  const id = req.params.id;

  // Tipos de colección
  const tiposValidos = ['hospitales', 'medicos', 'usuarios'];

  if (!tiposValidos.includes(tipo)) {
    return res.status(400).json({
      ok: false,
      mensaje: 'Tipo de colección no es válida',
      errors: { message: 'Tipo de colección no es válida'}
    });
  }

  if (!req.files) {
    return res.status(400).json({
      ok: false,
      mensaje: 'No hay archivos',
      errors: { message: 'Debe seleccionar una imagen'}
    });
  }

  // Obtener nombre del archivo
  const archivo = req.files.imagen;
  const nombreCortado = archivo.name.split('.');
  const [extensionArchivo] = nombreCortado.slice(-1);

  // Validación de extensión
  const extensionesValidas = ['png', 'jpg', 'gif', 'jpeg'];

  if (!extensionesValidas.includes(extensionArchivo)) {
    return res.status(400).json({
      ok: false,
      mensaje: 'Extensión no válida',
      errors: { message: `Las extensiones válidas son ${extensionesValidas.join(', ')}`},
    });
  }

  // Personalización de nombre de archivo
  const nombreArchivo = `${id}-${new Date().getMilliseconds()}.${extensionArchivo}`;

  // Mover el archivo del temporal a un path
  const path = `./uploads/${tipo}/${nombreArchivo}`;

  archivo.mv(path, (err) => {
    if (err) {
      return res.status(500).json({
        ok: false,
        mensaje: 'Error al mover archivo',
        errors: err,
      });
    }

    subirPorTipo(tipo, id, nombreArchivo, res);

    /*
    res.status(200).json({
      ok: true,
      mensaje: 'Archivo movido',
      extensionArchivo,
    });
    */
  });
});

const subirPorTipo = (tipo, id, nombreArchivo, res) => {
  const modelos = {
    usuarios: Usuario,
    medicos: Medico,
    hospitales: Hospital,
  };

  const campoTipo = {
    usuarios: 'usuario',
    medicos: 'medico',
    hospitales: 'hospital',
  };


  if (modelos.hasOwnProperty(tipo)) {
    modelos[tipo].findById(id, (err, modelo) => {
      const pathViejo = `./uploads/${tipo}/${modelo.img}`;

      if (fs.existsSync(pathViejo)) {
        fs.unlink(pathViejo, (err) => {
          if (err) {
            return res.status(500).json({
              ok: false,
              mensaje: 'Error al eliminar archivo',
              errors: err,
            });
          }
        });
      }

      modelo.img = nombreArchivo;
      modelo.save((err, modeloActualizado) => {
        if (err) {
          return res.status(500).json({
            ok: false,
            mensaje: `Error al actualizar ${campoTipo[tipo]}`,
          })
        }

        return res.status(200).json({
          ok: true,
          mensaje: `Imagen de ${campoTipo[tipo]} actualizada`,
          [campoTipo[tipo]]: modeloActualizado,
        })
      });
    })
  }
}

module.exports = app;