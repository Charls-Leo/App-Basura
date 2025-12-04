require('dotenv').config();
const express = require('express');
const cors = require('cors');
const app = express();

const PORT = process.env.PORT || 3000;

// Habilitar CORS para permitir peticiones desde Angular
app.use(cors({
    origin: [
        'http://localhost:4200',
        'http://ecorecolecta.eleueleo.com'
    ],
    credentials: true
}));

// Middleware para leer JSON
app.use(express.json());

// Importar rutas
const usuariosRoutes = require('./routes/usuarios');

// Usar rutas
app.use('/api/usuarios', usuariosRoutes);

// ======================
// RUTAS DE RUTAS (en memoria por ahora)
// ======================

// Array en memoria para guardar rutas creadas
const rutasMemoria = [];

// POST /api/rutas -> crear y guardar ruta en memoria
app.post('/api/rutas', (req, res) => {
  console.log('📍 Ruta recibida desde el frontend:');
  console.log(req.body);

  const nuevaRuta = {
    id: rutasMemoria.length + 1, // id simple incremental
    ...req.body
  };

  rutasMemoria.push(nuevaRuta);

  res.status(201).json({
    message: 'Ruta guardada correctamente',
    data: nuevaRuta
  });
});

// GET /api/rutas -> devolver todas las rutas guardadas
app.get('/api/rutas', (req, res) => {
  res.json(rutasMemoria);
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