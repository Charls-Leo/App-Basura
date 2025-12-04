// backend/routes/usuarios.js
const express = require('express');
const router = express.Router();
const pool = require('../db/connection');

const {
  registro,
  login,
  obtenerTodos
} = require('../controllers/usuariosController');

router.post('/registro', registro);
router.post('/login', login);
router.get('/', obtenerTodos);

module.exports = router;
