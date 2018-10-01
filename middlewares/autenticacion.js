const jwt = require('jsonwebtoken');
const SEED = require('../config/config').SEED;

// ==========================================
// Verificar Token
// ==========================================
exports.verificaToken = (req, res, next) => {
  const authorizationHeader = req.headers.authorization;
  
  if (!authorizationHeader) {
    return res.status(400).json({
      ok: false,
      mensaje: 'El header de autorización es requerido',
      errors: { message: 'El header de autorización es requerido'}   
    });
  }

  const authorizationType = req.headers.authorization.split(' ')[0];
  if (!(authorizationType === 'Bearer')) {
    return res.status(400).json({
      ok: false,
      mensaje: 'Método de autorización inválido',
      errors: 'El método de autorización no es válido',
    });
  };

  const token = req.headers.authorization.split(' ')[1];
  jwt.verify(token, SEED, (err, decoded) => {
    if (err) {
      return res.status(401).json({
        ok: false,
        mensaje: 'Token incorrecto',
        errors: err,        
      });
    }
    req.usuario = decoded.usuario;
    next();
  });
}

exports.verificaAdminOMismoUsuario = (req, res, next) => {
  const usuario = req.usuario;
  const id = req.params.id;

  if (usuario.role === 'ADMIN_ROLE' || usuario._id === id ) {
    next();
  } else {
    return res.status(401).json({
      ok: false,
      mensaje: 'Token incorrecto - No es administrador',
      errors: { message: 'No es administrador, no puede hacer eso' },
    });
  }
}