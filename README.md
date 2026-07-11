# 🛒 CentralEats - Frontend 🚀

CentralEats es una plataforma de gestión de comida tipo "Click & Collect" de alto rendimiento, diseñada específicamente para la comunidad de la Universidad Central del Ecuador (UCE). Su arquitectura desacoplada y optimizada garantiza tiempos de carga ultra rápidos y una experiencia de usuario fluida tanto en dispositivos móviles (Android/iOS) como en ordenadores (Web/Desktop).

---

## 👨‍💻 Dirección del Proyecto
*   **Desarrollador Principal y Arquitecto UI/UX:** Kevin Moyon

---

## 🛠️ Tecnologías y Stack Técnico
El proyecto utiliza un ecosistema moderno, fuertemente tipado y reactivo:

*   **Entorno & Framework:** React 19, TypeScript, Vite.
*   **Sistema de Diseño:** Chakra UI v3.
*   **Gestión de Estado & Caché:** React Query (TanStack Query v5) & Zustand.
*   **Seguridad / Autenticación:** Clerk (Autenticación institucional y social).
*   **Cliente HTTP:** Axios (configurado con interceptores para propagar tokens y gestionar timeouts).
*   **Entornos Nativos / Híbridos:**
    *   **Desktop:** Electron.
    *   **Mobile:** Capacitor.

---

## 📐 Arquitectura del Proyecto (Multi-Entrada Aislada)
Para evitar la contaminación cruzada de código y librerías entre plataformas, el frontend implementa una arquitectura **Multi-page Vite** con puntos de entrada separados a nivel de compilación:

```text
├── index.html                  # Punto de entrada HTML para Web y Desktop
├── index.mobile.html           # Punto de entrada HTML exclusivo para Mobile
├── vite.config.ts              # Configuración de Vite para Web/Desktop (Carpeta /dist)
├── vite.mobile.config.ts       # Configuración de Vite para Mobile (Carpeta /dist-mobile)
├── capacitor.config.json       # Configura Capacitor apuntando a /dist-mobile
├── electron-builder.yml        # Configura la compilación del instalador de escritorio (.exe)
└── src/
    ├── main.tsx                # Script de arranque para Web y Desktop (Carga Clerk, Routers, etc.)
    ├── mobile-main.tsx         # Script de arranque para Mobile (Aislado, ligero, sin Clerk)
    ├── api/                    # Instancia de Axios y configuración de llamadas
    ├── components/             # Átomos, Moléculas, Organismos y Layouts (Atomic Design)
    ├── features/               # Módulos específicos (deliveryStats, vendorMetrics)
    ├── hooks/                  # Lógica de negocio y queries (React Query)
    ├── utils/                  # Herramientas globales (saneamiento de archivos, detección de Electron)
    └── App.tsx                 # Definición de rutas y lógica de protección de rutas Web/Desktop
```

---

## 🚀 Guía de Instalación y Desarrollo Local

### 1. Requisitos Previos
*   **Node.js:** Versión 22 o superior.
*   **NPM:** Incluido con Node.js.

### 2. Variables de Entorno (`.env`)
Crea un archivo `.env` en la raíz del proyecto basándote en `.env.example`:
```env
VITE_CLERK_PUBLISHABLE_KEY=pk_test_... # Llave pública de Clerk
VITE_API_BASE_URL=http://localhost:3000
```

### 3. Instalación
Instala las dependencias necesarias omitiendo conflictos de versiones antiguas si las hubiera:
```bash
npm install
```

### 4. Ejecución en Modo Desarrollo
Elige el entorno que deseas probar localmente:

*   **Ejecutar Web:**
    ```bash
    npm run dev
    ```
    *Servidor local por defecto en: http://localhost:5173*

*   **Ejecutar Mobile (Simulador Web):**
    ```bash
    npm run dev:mobile
    ```
    *Servidor local exclusivo para móvil en: http://localhost:5174*

*   **Ejecutar Desktop (Electron en Caliente):**
    ```bash
    npm run electron:dev
    ```

---

## 📦 Compilación y Generación de Ejecutables (.exe / .apk)

### 🖥️ Desktop (Windows `.exe`)
La aplicación de escritorio se genera utilizando **Electron Builder**. Nota que el ejecutable de escritorio actúa como un visor web optimizado y seguro conectado a las instancias oficiales de QA o Producción para mantener persistencia e integridad de datos:

1.  **Compilar y empaquetar para QA:**
    ```bash
    npm run electron:build:win:qa
    ```
2.  **Compilar y empaquetar para Producción:**
    ```bash
    npm run electron:build:win:prod
    ```
*El instalador generado se guardará en la carpeta `/release` con el formato: `CentralEats-Setup-X.X.X.exe`.*

### 📱 Mobile (Android `.apk` / iOS)
La aplicación móvil (Panel de Pedidos para Repartidores) está desacoplada y compila a su propio directorio `/dist-mobile` sin incluir la sobrecarga de Clerk o vistas web:

1.  **Compilar el Frontend Móvil:**
    ```bash
    npm run build:mobile:dev    # Para desarrollo
    npm run build:mobile:qa     # Para pruebas QA
    npm run build:mobile:prod   # Para producción
    ```
    *(Este comando compila el proyecto y ejecuta `npx cap sync` automáticamente para sincronizar los assets en las carpetas nativas).*

2.  **Generar el ejecutable móvil (Android / iOS):**
    *   **Abrir en Android Studio (Para generar APK/AAB):**
        ```bash
        npx cap open android
        ```
        *Desde Android Studio, selecciona **Build > Build Bundle(s) / APK(s) > Build APK(s)**.*
    *   **Abrir en Xcode (Para iOS):**
        ```bash
        npx cap open ios
        ```

---

## ⚙️ Saneamiento de Archivos e Imágenes (Accentos y Caracteres Especiales)
Para evitar problemas de **CORS**, **Mojibake** (ej. ver imágenes rotas con nombres como `Sopa_wantÃ¡n.jpg`) y respuestas **404 (Not Found)** en servidores Linux/Nginx:

1.  **En Subida de Archivos:** El cliente sanea el nombre de las imágenes antes de enviarlas al servidor mediante la utilidad `prepareFileForUpload` de `src/utils/imageUtils.ts`. Se eliminan las tildes, caracteres especiales y espacios en blanco, reemplazándolos con caracteres limpios (ej. `á` -> `a`, espacios -> `_`).
2.  **En Renderizado:** Para archivos históricos que ya cuenten con nombres corruptos en la base de datos, el cliente ejecuta la función `fixImageUrl` al instanciar las URLs de las imágenes, recuperando automáticamente las codificaciones UTF-8 rotas.

---

## 🌐 Flujo de Integración y Despliegue Continuo (CI/CD)

El proyecto utiliza **GitHub Actions** para el despliegue automático en la infraestructura de AWS (EC2) mediante contenedores Docker.

### 🧪 Entorno de Pruebas (QA)
*   **Desencadenante:** Push a la rama `QA` (o dispatch automático desde el despliegue del backend).
*   **Proceso:**
    1.  Se descarga el repositorio y se genera la imagen Docker del frontend.
    2.  Se publica la imagen en Docker Hub (`centraleats-frontend:qa`).
    3.  Se conecta mediante SSH al servidor EC2 de QA.
    4.  Se descarga la nueva imagen y se realiza un despliegue seguro "Hot Swap" con rollback automático si el Smoke Test de salud falla.
    5.  Envía notificaciones del estado a Discord.

### 🚀 Entorno de Producción (Prod)
*   **Desencadenante:** Push a la rama `main` (o despacho manual).
*   **Proceso:**
    1.  Calcula y crea una nueva etiqueta Git de versión semántica (ej. `v1.0.2`).
    2.  Promueve la imagen aprobada en QA a Producción en Docker Hub.
    3.  Descarga y despliega el nuevo contenedor en el servidor EC2 de producción en el puerto `8080`.
    4.  Crea una GitHub Release automática con el registro de cambios.
    5.  Envía notificaciones de éxito/fallo a Discord.
