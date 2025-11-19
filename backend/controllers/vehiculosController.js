const pool = require('../db/connection');

// Registrar vehículo
const registrarVehiculo = async (req, res) => {
  try {
    const { placa, tipo, capacidad } = req.body;

    if (!placa || !tipo || !capacidad) {
      return res.status(400).json({ error: 'Faltan datos obligatorios' });
    }

    const existe = await pool.query(
      'SELECT * FROM vehiculos WHERE placa = $1',
      [placa]
    );

    if (existe.rows.length > 0) {
      return res.status(400).json({ error: 'La placa ya está registrada' });
    }

    const nuevo = await pool.query(
      'INSERT INTO vehiculos (placa, tipo, capacidad) VALUES ($1, $2, $3) RETURNING *',
      [placa, tipo, capacidad]
    );

    res.status(201).json(nuevo.rows[0]);

  } catch (error) {
    console.error('Error al registrar vehículo:', error);
    res.status(500).json({ error: 'Error al registrar vehículo' });
  }
};

// Listar vehículos
const obtenerVehiculos = async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM vehiculos ORDER BY id ASC');
    res.json(result.rows);
  } catch (error) {
    console.error('Error al obtener vehículos:', error);
    res.status(500).json({ error: 'Error al obtener vehículos' });
  }
};

// Actualizar vehículo
const actualizarVehiculo = async (req, res) => {
  try {
    const { id } = req.params;
    const { placa, tipo, capacidad } = req.body;

    if (!placa || !tipo || !capacidad) {
      return res.status(400).json({ error: 'Faltan datos obligatorios' });
    }

    const existe = await pool.query(
      'SELECT * FROM vehiculos WHERE id = $1',
      [id]
    );

    if (existe.rows.length === 0) {
      return res.status(404).json({ error: 'Vehículo no encontrado' });
    }

    const actualizado = await pool.query(
      `UPDATE vehiculos 
       SET placa = $1, tipo = $2, capacidad = $3 
       WHERE id = $4
       RETURNING *`,
      [placa, tipo, capacidad, id]
    );

    res.json({
      mensaje: 'Vehículo actualizado correctamente',
      vehiculo: actualizado.rows[0]
    });

  } catch (error) {
    console.error('Error al actualizar vehículo:', error);
    res.status(500).json({ error: 'Error al actualizar vehículo' });
  }
};

// Eliminar vehículo
const eliminarVehiculo = async (req, res) => {
  try {
    const { id } = req.params;

    const existe = await pool.query(
      'SELECT * FROM vehiculos WHERE id = $1',
      [id]
    );

    if (existe.rows.length === 0) {
      return res.status(404).json({ error: 'Vehículo no encontrado' });
    }

    await pool.query('DELETE FROM vehiculos WHERE id = $1', [id]);

    res.json({ mensaje: 'Vehículo eliminado correctamente' });

  } catch (error) {
    console.error('Error al eliminar vehículo:', error);
    res.status(500).json({ error: 'Error al eliminar vehículo' });
  }
};

// EXPORTAR TODO
module.exports = { 
  registrarVehiculo, 
  obtenerVehiculos, 
  actualizarVehiculo,
  eliminarVehiculo
};