const express = require('express');
const router = express.Router();
const { registrarVehiculo, obtenerVehiculos, actualizarVehiculo, eliminarVehiculo } = require('../controllers/vehiculosController');

// Registrar vehículo
router.post('/registro', registrarVehiculo);

// Listar vehículos
router.get('/', obtenerVehiculos);

// Actualizar vehículo
router.put('/:id', actualizarVehiculo);

// Eliminar vehículo
router.delete('/:id', eliminarVehiculo);

module.exports = router;
