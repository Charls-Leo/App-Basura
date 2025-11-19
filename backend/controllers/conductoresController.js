const pool = require('../db/connection');

// Registrar conductor
const registrarConductor = async (req, res) => {
  try {
    const { nombre, cedula, telefono, licencia } = req.body;

    if (!nombre || !cedula || !licencia) {
      return res.status(400).json({ error: 'Faltan datos obligatorios' });
    }

    // Validar cédula única
    const existe = await pool.query(
      'SELECT * FROM conductores WHERE cedula = $1',
      [cedula]
    );

    if (existe.rows.length > 0) {
      return res.status(400).json({ error: 'La cédula ya está registrada' });
    }

    // Insertar
    const nuevo = await pool.query(
      `INSERT INTO conductores (nombre, cedula, telefono, licencia)
       VALUES ($1, $2, $3, $4) RETURNING *`,
      [nombre, cedula, telefono, licencia]
    );

    res.status(201).json(nuevo.rows[0]);

  } catch (error) {
    console.error('Error al registrar conductor:', error);
    res.status(500).json({ error: 'Error al registrar conductor' });
  }
};

// Listar conductores
const obtenerConductores = async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM conductores ORDER BY id ASC');
    res.json(result.rows);
  } catch (error) {
    console.error('Error al obtener conductores:', error);
    res.status(500).json({ error: 'Error al obtener conductores' });
  }
};

// Actualizar conductor
const actualizarConductor = async (req, res) => {
  try {
    const { id } = req.params;
    const { nombre, cedula, telefono, licencia } = req.body;

    if (!nombre || !cedula || !licencia) {
      return res.status(400).json({ error: 'Faltan datos obligatorios' });
    }

    const existe = await pool.query('SELECT * FROM conductores WHERE id = $1', [id]);

    if (existe.rows.length === 0) {
      return res.status(404).json({ error: 'Conductor no encontrado' });
    }

    const actualizado = await pool.query(
      `UPDATE conductores 
       SET nombre = $1, cedula = $2, telefono = $3, licencia = $4 
       WHERE id = $5 
       RETURNING *`,
      [nombre, cedula, telefono, licencia, id]
    );

    res.json({
      mensaje: 'Conductor actualizado correctamente',
      conductor: actualizado.rows[0]
    });

  } catch (error) {
    console.error('Error al actualizar conductor:', error);
    res.status(500).json({ error: 'Error al actualizar conductor' });
  }
};

// Eliminar conductor
const eliminarConductor = async (req, res) => {
  try {
    const { id } = req.params;

    const existe = await pool.query('SELECT * FROM conductores WHERE id = $1', [id]);

    if (existe.rows.length === 0) {
      return res.status(404).json({ error: 'Conductor no encontrado' });
    }

    await pool.query('DELETE FROM conductores WHERE id = $1', [id]);

    res.json({ mensaje: 'Conductor eliminado correctamente' });

  } catch (error) {
    console.error('Error al eliminar conductor:', error);
    res.status(500).json({ error: 'Error al eliminar conductor' });
  }
};

module.exports = { 
  registrarConductor, 
  obtenerConductores, 
  actualizarConductor,
  eliminarConductor
};
