const express = require('express');
const router = express.Router();

const {
  registrarUsuario,
  loginUsuario,
  obtenerUsuarios,
  obtenerUsuarioPorId,
  actualizarUsuario,
  eliminarUsuario
} = require('../controllers/usuariosController');

// Registrar nuevo usuario
router.post('/registro', registrarUsuario);

// Login de usuario
router.post('/login', loginUsuario);

// Listar todos los usuarios
router.get('/', obtenerUsuarios);

// Obtener usuario por ID
router.get('/:id', obtenerUsuarioPorId);

// Actualizar usuario
router.put('/:id', actualizarUsuario);

// Eliminar usuario
router.delete('/:id', eliminarUsuario);

module.exports = router;
