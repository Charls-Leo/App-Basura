const express = require('express');
const router = express.Router();

const { 
  registrarVehiculo, 
  obtenerVehiculos, 
  actualizarVehiculo 
} = require('../controllers/vehiculosController');

// Registrar vehículo
router.post('/registro', registrarVehiculo);

// Listar vehículos
router.get('/', obtenerVehiculos);

// Editar vehículo
router.put('/editar/:id', actualizarVehiculo);

module.exports = router;
