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

// Login
router.post('/login', loginUsuario);

// Listar todos
router.get('/', obtenerUsuarios);

// Obtener por ID
router.get('/:id', obtenerUsuarioPorId);

// Actualizar
router.put('/:id', actualizarUsuario);

// Eliminar
router.delete('/:id', eliminarUsuario);

module.exports = router;
