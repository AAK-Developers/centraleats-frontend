# 🛒 CentralEats - Frontend 🚀

CentralEats is a high-performance "Click & Collect" food management platform specifically designed for the community at the Universidad Central del Ecuador (UCE). Its Mobile-First architecture ensures ultra-fast loading times and a seamless user experience across the campus.

## 👨‍💻 Project Lead
**Lead Developer & UI/UX Architect:** Kevin Moyon

## 🛠️ Tech Stack
The project utilizes a modern, strongly-typed, and reactive stack designed to handle the high concurrency of university life:

* **Runtime & Framework:** React 19, TypeScript, Vite.
* **Design System:** Chakra UI.
* **Auth Layer:** Clerk (Institutional and social authentication).
* **Networking:** Axios (with Nginx Reverse Proxy in QA/Prod).

## 🚀 Guía de Instalación y Desarrollo Local

Para que los miembros del equipo puedan correr el proyecto en sus máquinas:

### 1. Requisitos Previos
*   **Node.js:** Versión 22 o superior.
*   **Gestor de paquetes:** npm.

### 2. Configuración del Entorno (`.env`)
Crea un archivo `.env` en la raíz del proyecto basado en `.env.example`:

```env
VITE_CLERK_PUBLISHABLE_KEY=tu_clave_de_clerk
VITE_API_BASE_URL=http://localhost:3000
```

### 3. Instalación
```bash
npm install
```

### 4. Ejecución
```bash
npm run dev
```

---

## 🌐 Despliegue y Conectividad (QA / Prod)

Este proyecto utiliza un **Proxy Inverso con Nginx** para evitar problemas de CORS y Mixed Content (HTTP/HTTPS) en entornos de red reales.

### Configuración en GitHub Secrets
Para que los flujos de Actions funcionen correctamente, asegúrate de tener estas variables configuradas en GitHub:

*   **`VITE_API_URL_QA`**: `https://centraleatsqa.programacionwebuce.net` (URL del frontend, el proxy redirige al backend).
*   **`VITE_API_URL_PROD`**: URL final de producción.
*   **`BACKEND_ADDR_QA`**: `http://98.81.131.147:3001` (La IP real del backend de QA, se inyecta de forma segura).
*   **`BACKEND_ADDR_PROD`**: La IP real del backend de producción.
*   **`VITE_CLERK_PUBLISHABLE_KEY`**: Tu clave de Clerk.

### Configuración del Servidor (Docker Compose)
En el servidor de QA/Prod, el archivo `docker-compose.yml` maneja la IP del backend mediante una variable de entorno inyectada por GitHub Actions, manteniendo la IP fuera del repositorio público:

```yaml
services:
  app:
    environment:
      - BACKEND_ADDR=${BACKEND_ADDR}
```

---

## 📐 Arquitectura (Atomic Design)
El directorio `/src` implementa Atomic Design para maximizar la reutilización y el mantenimiento:

```text
src/
├── api/            # Instancia de Axios y configuración de interceptores
├── components/     # Átomos, Moléculas, Organismos y Layouts
├── hooks/          # Lógica de negocio y llamadas a la API (refactorizadas a Axios)
├── pages/          # Vistas principales (Auth, Dashboard, Registro)
└── App.tsx         # Definición de rutas y lógica de protección (ProtectedRoute)
```

## ✅ Estándares de Código y CI
*   **Linting:** Se utiliza ESLint para asegurar la calidad del código. Ejecuta `npm run lint` antes de subir cambios.
*   **Build:** El proyecto se compila con `tsc -b && vite build`. Es obligatorio pasar el build para que el CI valide la rama `dev`.
