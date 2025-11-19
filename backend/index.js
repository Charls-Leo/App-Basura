require('dotenv').config();
const express = require('express');
const app = express();

const PORT = process.env.PORT || 3000;

// Middleware para leer JSON
app.use(express.json());

// Importar rutas
const healthRoutes = require('./routes/health');
const vehiculosRoutes = require('./routes/vehiculos');  // <--- FALTABA ESTO

// Registrar rutas
app.use('/api', healthRoutes);
app.use('/api/vehiculos', vehiculosRoutes);  // <--- MUY IMPORTANTE

// Ruta principal
app.get('/', (req, res) => {
  res.send('API Backend EcoRecolecta - ¡Funciona!');
});

// Manejo de errores
app.use((req, res) => {
  res.status(404).json({ error: 'Ruta no encontrada' });
});

// Iniciar servidor
app.listen(PORT, () => {
  console.log(`Servidor escuchando en http://localhost:${PORT}`);
});
