// src/index.js
require('dotenv').config();
const express = require('express');
const app = express();

const PORT = process.env.PORT || 3000;

// Middleware para leer JSON en las solicitudes
app.use(express.json());

// Importar rutas
const healthRoutes = require('./src/routes/health');
app.use('/api', healthRoutes);

// Ruta principal de prueba
app.get('/', (req, res) => {
  res.send('API Backend EcoRecolecta - ¡Funciona!');
});

// Manejo de errores 404
app.use((req, res) => {
  res.status(404).json({ error: 'Ruta no encontrada' });
});

// Iniciar el servidor
app.listen(PORT, () => {
  console.log(`Servidor escuchando en http://localhost:${PORT}`);
});
