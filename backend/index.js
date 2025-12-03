require('dotenv').config();
const express = require('express');
const app = express();

const PORT = process.env.PORT || 3000;

// Middleware para leer JSON
app.use(express.json());

// Importar rutas
const healthRoutes = require('./src/routes/health');
const vehiculosRoutes = require('./routes/vehiculos'); 
const conductoresRoutes = require('./routes/conductores');
const usuariosRoutes = require('./routes/usuarios');

// Registrar rutas
app.use('/api', healthRoutes);
app.use('/api/vehiculos', vehiculosRoutes);  // <--- MUY IMPORTANTE
app.use('/api/conductores', conductoresRoutes);
app.use('/api/usuarios', usuariosRoutes);
app.use('/api/rutas', require('./routes/rutas'));

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
