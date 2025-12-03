const pool = require('../db/connection');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

// Registrar usuario
const registrarUsuario = async (req, res) => {
  try {
    const { nombre, correo, contrasena, perfil_id } = req.body;

    if (!nombre || !correo || !contrasena || !perfil_id) {
      return res.status(400).json({ error: 'Faltan datos obligatorios' });
    }

    // Verificar si el correo ya existe
    const existe = await pool.query(
      'SELECT * FROM usuarios WHERE correo = $1',
      [correo]
    );

    if (existe.rows.length > 0) {
      return res.status(400).json({ error: 'El correo ya está registrado' });
    }

    // Encriptar contraseña
    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(contrasena, salt);

    // Insertar usuario
    const nuevoUsuario = await pool.query(
      `INSERT INTO usuarios (nombre, correo, contrasena, perfil_id)
       VALUES ($1, $2, $3, $4)
       RETURNING id, nombre, correo, perfil_id`,
      [nombre, correo, hash, perfil_id]
    );

    res.status(201).json({
      mensaje: 'Usuario registrado correctamente',
      usuario: nuevoUsuario.rows[0]
    });

  } catch (error) {
    console.error('Error al registrar usuario:', error);
    res.status(500).json({ error: 'Error al registrar usuario' });
  }
};

// Login
const loginUsuario = async (req, res) => {
  try {
    const { correo, contrasena } = req.body;

    if (!correo || !contrasena) {
      return res.status(400).json({ error: 'Faltan datos obligatorios' });
    }

    // Verificar correo
    const usuario = await pool.query(
      'SELECT * FROM usuarios WHERE correo = $1',
      [correo]
    );

    if (usuario.rows.length === 0) {
      return res.status(400).json({ error: 'Usuario no encontrado' });
    }

    // Comparar contraseña
    const validPass = await bcrypt.compare(contrasena, usuario.rows[0].contrasena);
    if (!validPass) {
      return res.status(400).json({ error: 'Contraseña incorrecta' });
    }

    // Generar token JWT
    const token = jwt.sign(
      { id: usuario.rows[0].id, perfil_id: usuario.rows[0].perfil_id },
      process.env.JWT_SECRET || 'secret123',
      { expiresIn: '8h' }
    );

    res.json({ mensaje: 'Login exitoso', token });

  } catch (error) {
    console.error('Error en login:', error);
    res.status(500).json({ error: 'Error en login' });
  }
};

// Listar todos los usuarios
const obtenerUsuarios = async (req, res) => {
  try {
    const result = await pool.query(
      'SELECT id, nombre, correo, perfil_id FROM usuarios ORDER BY id ASC'
    );
    res.json(result.rows);
  } catch (error) {
    console.error('Error al obtener usuarios:', error);
    res.status(500).json({ error: 'Error al obtener usuarios' });
  }
};

// Obtener usuario por ID
const obtenerUsuarioPorId = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await pool.query(
      'SELECT id, nombre, correo, perfil_id FROM usuarios WHERE id = $1',
      [id]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Usuario no encontrado' });
    }
    res.json(result.rows[0]);
  } catch (error) {
    console.error('Error al obtener usuario:', error);
    res.status(500).json({ error: 'Error al obtener usuario' });
  }
};

// Actualizar usuario
const actualizarUsuario = async (req, res) => {
  try {
    const { id } = req.params;
    const { nombre, correo, contrasena, perfil_id } = req.body;

    const usuarioExistente = await pool.query(
      'SELECT * FROM usuarios WHERE id = $1',
      [id]
    );

    if (usuarioExistente.rows.length === 0) {
      return res.status(404).json({ error: 'Usuario no encontrado' });
    }

    let hash = usuarioExistente.rows[0].contrasena;
    if (contrasena) {
      const salt = await bcrypt.genSalt(10);
      hash = await bcrypt.hash(contrasena, salt);
    }

    const actualizado = await pool.query(
      `UPDATE usuarios
       SET nombre = $1, correo = $2, contrasena = $3, perfil_id = $4
       WHERE id = $5
       RETURNING id, nombre, correo, perfil_id`,
      [nombre, correo, hash, perfil_id, id]
    );

    res.json({
      mensaje: 'Usuario actualizado correctamente',
      usuario: actualizado.rows[0]
    });

  } catch (error) {
    console.error('Error al actualizar usuario:', error);
    res.status(500).json({ error: 'Error al actualizar usuario' });
  }
};

// Eliminar usuario
const eliminarUsuario = async (req, res) => {
  try {
    const { id } = req.params;

    const existe = await pool.query(
      'SELECT * FROM usuarios WHERE id = $1',
      [id]
    );

    if (existe.rows.length === 0) {
      return res.status(404).json({ error: 'Usuario no encontrado' });
    }

    await pool.query(
      'DELETE FROM usuarios WHERE id = $1',
      [id]
    );

    res.json({ mensaje: 'Usuario eliminado correctamente' });
  } catch (error) {
    console.error('Error al eliminar usuario:', error);
    res.status(500).json({ error: 'Error al eliminar usuario' });
  }
};

module.exports = {
  registrarUsuario,
  loginUsuario,
  obtenerUsuarios,
  obtenerUsuarioPorId,
  actualizarUsuario,
  eliminarUsuario
};
