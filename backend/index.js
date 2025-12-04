require('dotenv').config();
const express = require('express');
const cors = require('cors');
const app = express();

const PORT = process.env.PORT || 3000;

// Habilitar CORS para permitir peticiones desde Angular
app.use(cors({
  origin: 'http://localhost:4200'
}));

// Middleware para leer JSON
app.use(express.json());

// Importar rutas
const usuariosRoutes = require('./routes/usuarios');

// Usar rutas
app.use('/api/usuarios', usuariosRoutes);

// Ruta para crear rutas (provisional para pruebas)
app.post('/api/rutas', (req, res) => {
  console.log('📍 Ruta recibida desde el frontend:');
  console.log(req.body);  // Aquí llega el payload con nombre_ruta, perfil_id, shape

  res.status(201).json({
    message: 'Ruta recibida correctamente en el backend',
    data: req.body
  });
});

// Ruta principal
app.get('/', (req, res) => {
  res.send('API Backend EcoRecolecta');
});

// Manejo de errores
app.use((req, res) => {
  res.status(404).json({ error: 'Ruta no encontrada' });
});

// Iniciar servidor
app.listen(PORT, () => {
  console.log(`Servidor escuchando en http://localhost:${PORT}`);
});
