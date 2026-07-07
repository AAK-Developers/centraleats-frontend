# Panel de Pedidos — React + Capacitor

Dashboard móvil que consume `http://98.81.131.147:3001/api/stats/dashboard`
y muestra los datos en gráficos (Recharts) con un diseño claro y elegante:
tarjetas con iconos de color (`lucide-react`), rankings con badges numerados
y barras de progreso, agrupados en secciones (Resumen general, Actividad,
Rankings, Recientes).

## 1. Probar en el navegador (rápido, sin Android Studio)

```bash
npm install
npm run dev
```

Abre la URL que te muestre la terminal (normalmente `http://localhost:5173`).
Aquí ya puedes ver si el fetch al backend funciona, sin tocar nada de Android.

> Nota: si ves un error de CORS en el navegador (no pasa en el APK), es porque
> el backend debe permitir requests desde otro origen. Si te sale eso, avísame
> y ajustamos el backend o hacemos un proxy de desarrollo en Vite.

## 2. Generar el build web

```bash
npm run build
```

Esto crea la carpeta `dist/`, que es lo que Capacitor empaqueta dentro del APK.

## 3. Agregar la plataforma Android

```bash
npm install @capacitor/core @capacitor/cli @capacitor/android
npx cap add android
npx cap sync
```

Esto crea la carpeta `android/` con un proyecto nativo completo.

## 4. Aplicar el permiso de tráfico HTTP (paso clave anti-error)

Por defecto, Android bloquea peticiones HTTP (no HTTPS) desde la API 28.
Como tu backend es `http://98.81.131.147:3001` (sin SSL), hay que autorizar
explícitamente esa IP — sin desactivar la seguridad para toda la app.

**a) Copia el archivo de configuración:**

```bash
cp android-config/network_security_config.xml android/app/src/main/res/xml/network_security_config.xml
```

(si la carpeta `xml` no existe dentro de `res`, créala primero)

**b) Edita `android/app/src/main/AndroidManifest.xml`:**

Busca el tag `<application ...>` y agrégale el atributo
`android:networkSecurityConfig="@xml/network_security_config"`.

Ejemplo:

```xml
<application
    android:allowBackup="true"
    android:networkSecurityConfig="@xml/network_security_config"
    android:icon="@mipmap/ic_launcher"
    ...>
```

Con esto el APK podrá conectarse a tu IP sin el error
`ERR_CLEARTEXT_NOT_PERMITTED`, y el resto de la app sigue exigiendo HTTPS
(más seguro que desactivarlo globalmente).

## 5. Abrir en Android Studio y generar el APK

```bash
npx cap open android
```

Desde Android Studio: `Build > Build Bundle(s) / APK(s) > Build APK(s)`.
El APK queda en `android/app/build/outputs/apk/debug/`.

## 6. Cada vez que cambies el código React

```bash
npm run build
npx cap sync
```

(el paso 4 no hay que repetirlo, el archivo queda en el proyecto Android)

## Estructura (TypeScript)

```
src/
  types.ts                 → interfaces que reflejan la respuesta del endpoint
  theme.ts                  → paleta de acentos cíclica + formato de moneda
  api.ts                    → llamada al endpoint (tipada)
  App.tsx                   → orquesta fetch + estados (loading/error)
  components/
    shared.tsx              → IconTile, GroupLabel, BlockHeader (reutilizables)
    SummaryCards.tsx        → tarjetas resumen con iconos de color
    OrdersByHourChart.tsx   → pedidos por hora (área)
    StatusDistributionChart.tsx → estados de pedidos (donut)
    TopRestaurantsChart.tsx → ranking restaurantes (badge + barra de progreso)
    TopProductsChart.tsx    → productos más vendidos (miniatura + contador)
    DeliveryRankingList.tsx → tiempos de entrega (color según velocidad)
    RecentOrdersList.tsx    → últimos pedidos
android-config/
  network_security_config.xml    → permiso cleartext solo para tu IP
  AndroidManifest-snippet.xml    → qué línea agregar al manifest
```

`npm run build` ahora corre `tsc --noEmit` antes de compilar, así que si le pasas
mal la forma de un dato a un componente, te avisa en la terminal antes de tocar
Android Studio.

## Nota sobre CORS en el WebView de Android

`capacitor.config.json` ya incluye `androidScheme: "http"` (evita el bloqueo de
"mixed content" del WebView) y el plugin `CapacitorHttp` habilitado (evita el
bloqueo de CORS, ya que enruta las peticiones de forma nativa en vez de usar el
motor de red del WebView). Si ves error de CORS solo en el navegador de
escritorio (`npm run dev`), es normal y no afecta al APK — ver nota del paso 1.

## Cuando tengas HTTPS en el backend

Cuando muevas el backend a HTTPS (recomendado a futuro, ej. con un dominio +
Let's Encrypt o poniendo el backend detrás de Nginx/Cloudflare), puedes borrar
`android-config/network_security_config.xml` y la línea del manifest — ya no
hará falta ningún permiso especial.
