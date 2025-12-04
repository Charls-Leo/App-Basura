require('dotenv').config();
const express = require('express');
const cors = require('cors');   // ← AGREGAR ESTO

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());                // ← PERMITE PETICIONES DESDE ANGULAR
app.use(express.json());

const usuariosRoutes = require('./routes/usuarios');
app.use('/api/usuarios', usuariosRoutes);

app.get('/', (req, res) => {
  res.send('API Backend EcoRecolecta');
});

app.use((req, res) => {
  res.status(404).json({ error: 'Ruta no encontrada' });
});

app.listen(PORT, () => {
  console.log(`Servidor escuchando en http://localhost:${PORT}`);
});
