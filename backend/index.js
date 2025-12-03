require('dotenv').config();
const express = require('express');
const app = express();

const PORT = process.env.PORT || 3000;

// Middleware para leer JSON
app.use(express.json());

// Importar rutas
const usuariosRoutes = require('./routes/usuarios');

// Usar rutas
app.use('/api/usuarios', usuariosRoutes);


// Ruta principal
app.get('/', (req, res) => {
  res.send('API Backend EcoRecolecta');
});
// Manejo de errores
app.use((req, res) => {
  res.status(404).json({ error: 'Ruta no encontrada' });
});

// Iniciar servid
app.listen(PORT, () => {
  console.log(`Servidor escuchando en http://localhost:${PORT}`);
});
