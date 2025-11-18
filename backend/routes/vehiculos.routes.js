import { Router } from "express";
const router = Router();

// POST /api/vehiculos/registro
export default router;
router.post("/registro", async (req, res) => {
    console.log("Body recibido:", req.body); // <--- IMPORTANTE

    const { placa, modelo, tipo, capacidad } = req.body;

    try {
        const nuevoVehiculo = await pool.query(
            "INSERT INTO vehiculos (placa, modelo, tipo, capacidad) VALUES ($1, $2, $3, $4) RETURNING *",
            [placa, modelo, tipo, capacidad]
        );

        res.json(nuevoVehiculo.rows[0]);
    } catch (error) {
        console.error("Error en INSERT:", error);  // <---- VER EL ERROR REAL
        res.status(500).json({ error: "Error al registrar vehículo" });
    }
});