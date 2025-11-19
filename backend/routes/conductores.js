const express = require('express');
const router = express.Router();
const { 
  registrarConductor, 
  obtenerConductores,
  actualizarConductor,
  eliminarConductor
} = require('../controllers/conductoresController');

// Registrar
router.post('/registro', registrarConductor);

// Listar
router.get('/', obtenerConductores);

// Actualizar
router.put('/:id', actualizarConductor);

// Eliminar
router.delete('/:id', eliminarConductor);

module.exports = router;
