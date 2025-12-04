// backend/controllers/usuariosController.js
const pool = require('../db/connection');

const usuariosController = {
  // 🔐 LOGIN
  login: async (req, res) => {
    try {
      const { email, password } = req.body;

      console.log('🔍 Intentando login...');
      console.log('📧 Email recibido:', email);
      console.log('🔑 Password length:', password ? password.length : 0);

      // Validar que vengan los datos
      if (!email || !password) {
        console.log('❌ Faltan datos');
        return res.status(400).json({
          error: 'Email y contraseña son requeridos'
        });
      }

      // Limpiar espacios en blanco
      const emailLimpio = email.trim().toLowerCase();
      const passwordLimpio = password.trim();

      console.log('🔍 Buscando usuario con email:', emailLimpio);

      // Buscar usuario
      const resultado = await pool.query(
        'SELECT * FROM usuarios WHERE LOWER(email) = $1',
        [emailLimpio]
      );

      if (resultado.rows.length === 0) {
        console.log('❌ Usuario no encontrado');
        return res.status(401).json({
          error: 'Correo o contraseña incorrectos'
        });
      }

      const usuario = resultado.rows[0];
      console.log('👤 Usuario encontrado:', { 
        id: usuario.id, 
        email: usuario.email,
        passwordEnDB: usuario.password 
      });

      // Comparar contraseña (texto plano por ahora)
      if (usuario.password !== passwordLimpio) {
        console.log('❌ Contraseña incorrecta');
        console.log('   Esperada:', usuario.password);
        console.log('   Recibida:', passwordLimpio);
        return res.status(401).json({
          error: 'Correo o contraseña incorrectos'
        });
      }

      console.log('✅ Login exitoso para:', usuario.email);

      // Responder con datos del usuario (sin password)
      const { password: _, ...usuarioSinPassword } = usuario;

      res.json({
        mensaje: 'Login exitoso',
        usuario: usuarioSinPassword
      });

    } catch (error) {
      console.error('❌ Error en login:', error);
      res.status(500).json({
        error: 'Error en el servidor',
        detalle: error.message
      });
    }
  },

  // 📝 REGISTRO
  registro: async (req, res) => {
    try {
      const { email, password, rol, nombre } = req.body;

      console.log('📝 Intentando registrar usuario:', email);

      if (!email || !password || !nombre) {
        return res.status(400).json({
          error: 'Email, contraseña y nombre son requeridos'
        });
      }

      // Limpiar datos
      const emailLimpio = email.trim().toLowerCase();
      const passwordLimpio = password.trim();

      // Verificar si el email ya existe
      const existe = await pool.query(
        'SELECT id FROM usuarios WHERE LOWER(email) = $1',
        [emailLimpio]
      );

      if (existe.rows.length > 0) {
        console.log('❌ Email ya existe:', emailLimpio);
        return res.status(409).json({
          error: 'El email ya está registrado'
        });
      }

      // Insertar nuevo usuario
      const resultado = await pool.query(
        'INSERT INTO usuarios (email, password, rol, nombre) VALUES ($1, $2, $3, $4) RETURNING id, email, rol, nombre',
        [emailLimpio, passwordLimpio, rol || 'usuario', nombre.trim()]
      );

      console.log('✅ Usuario registrado:', resultado.rows[0].email);

      res.status(201).json({
        mensaje: 'Usuario registrado exitosamente',
        usuario: resultado.rows[0]
      });

    } catch (error) {
      console.error('❌ Error en registro:', error);
      res.status(500).json({
        error: 'Error en el servidor',
        detalle: error.message
      });
    }
  },

  // 📋 OBTENER TODOS LOS USUARIOS
  obtenerTodos: async (req, res) => {
    try {
      console.log('📋 Obteniendo todos los usuarios...');
      
      const resultado = await pool.query(
        'SELECT id, email, rol, nombre FROM usuarios ORDER BY id'
      );

      console.log(`✅ ${resultado.rows.length} usuarios encontrados`);

      res.json({
        usuarios: resultado.rows,
        total: resultado.rows.length
      });

    } catch (error) {
      console.error('❌ Error obteniendo usuarios:', error);
      res.status(500).json({
        error: 'Error en el servidor',
        detalle: error.message
      });
    }
  }
};

module.exports = usuariosController;