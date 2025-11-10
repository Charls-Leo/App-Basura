# ♻️ EcoRecolecta — Plataforma de Gestión de Residuos

Aplicación web desarrollada para optimizar el **reporte y seguimiento de puntos de basura** en la ciudad.  
Permite que los usuarios comuniquen incidencias de residuos y los gestores supervisen su recolección desde un panel central.

Este proyecto combina **Angular (frontend)**, **Node.js + Express (backend)** y **PostgreSQL (base de datos)**.

---

## 🎯 Objetivos del proyecto

- **Facilitar la comunicación** entre ciudadanos y entidades de limpieza.  
- **Registrar reportes** de recolección de basura en tiempo real.  
- **Ofrecer transparencia** sobre el estado de las recolecciones.  
- **Modernizar la interfaz** con un login limpio, accesible y adaptable.  

---

## ⚙️ Tecnologías utilizadas

| Capa | Tecnología |
|------|-------------|
| **Frontend** | Angular 17, HTML5, CSS3, TypeScript |
| **Backend** | Node.js + Express |
| **Base de datos** | PostgreSQL |
| **Estilos globales** | CSS puro (sin frameworks) |
| **Control de versiones** | Git + GitHub |
| **Servidor local** | Render / Railway (planeado) |

---

## 🧩 Estado actual

### ✅ **Backend**
- API REST funcional creada con **Express**.  
- Conexión establecida con **PostgreSQL**.  
- Endpoints disponibles:
  - `GET /api/reportes` → obtiene todos los reportes.  
  - `POST /api/reportes` → crea un nuevo reporte.  
- Configuración de variables de entorno con `.env`.  
- Módulo **CORS** habilitado para conexión con el frontend.

### ✅ **Frontend**
- Proyecto Angular estructurado y conectado al backend.  
- Flujo completo de **envío y visualización de reportes**.  
- Login desarrollado 100 % en frontend (sin autenticación real aún).  
- Diseño moderno y responsive con **tipografía Poppins**.  
- Fondo degradado ecológico 🌿 y patrón difuminado ♻️.  

---

## 🖥️ Interfaz actual — Pantalla de Login

### ✨ Características
- Diseño **60 % / 40 %** (izquierda ecológica / derecha formulario).  
- Sin scroll, con proporciones fijas y centrado vertical.  
- Animación sutil en el logo ♻️.  
- Fondo con íconos pequeños difuminados 🌿♻️ en patrón SVG repetido.  
- Mensaje simulado de **“Login exitoso (Frontend)”** al enviar formulario.  

### 📁 Estructura del componente
```bash
src/
└── app/
└── app/
└── auth/
└── login/
├── login.html
├── login.css
└── login.ts
```
> El login es completamente visual; el backend de autenticación se implementará más adelante.

---

## 📂 Estructura general del proyecto

```bash
App-Basura/
├── app-basura-backend/           # Servidor Node.js + Express
│   ├── src/
│   │   ├── index.js
│   │   ├── db.js
│   │   ├── routes/
│   │   │   └── reportes.js
│   │   └── controllers/
│   │       └── reportesController.js
│   ├── .env
│   └── package.json
│
└── app-frontend/                 # Proyecto Angular
    ├── src/
    │   ├── app/
    │   ├── styles.css
    │   └── ...
    ├── angular.json
    └── package.json
```

---

## 🚀 Ejecución local
🧠
Requisitos previos

- Node.js v18+
- Angular CLI
- PostgreSQL activo localmente

---

## ▶️ Backend

```bash
# 1) Ir al backend
cd app-basura-backend

# 2) Instalar dependencias
npm install

# 3) Ejecutar el servidor
npm run dev
```
> Servidor activo en 👉 http://localhost:3000

---

## 💻 Frontend

```bash
# 1) Ir al frontend
cd app-frontend

# 2) Instalar dependencias
npm install

# 3) Levantar Angular
ng serve --port 4100
```

> Abrir en el navegador 👉 http://localhost:4100

---

## 🧭 Próximos pasos

- Implementar autenticación real con JWT.
- Agregar roles (usuario / administrador).
- Sistema de notificaciones del estado de recolección.
- Integración con mapas interactivos (Leaflet o Google Maps).
- Despliegue del backend y frontend en la nube.
- Panel administrativo para gestores ambientales.
