# Wake-LAN App

Aplicación web para encender equipos de la red local mediante **Wake-on-LAN** y
ver de un vistazo cuáles están encendidos. Pensada para uso doméstico / red local,
con almacenamiento mínimo en un fichero JSON.

## Reglas de trabajo (IMPORTANTE)

- **Planificar primero, actuar después.** Ante cualquier tarea no trivial, primero
  propón un plan y espera confirmación antes de escribir código.
- **Nunca hagas commit.** El usuario hace los commits manualmente. No ejecutes
  `git commit`, `git push` ni operaciones que reescriban el historial.
- Ante dudas de diseño o requisitos, **pregunta** en lugar de asumir.
- Para UI usar los recursos disponibles del entorno: plugin **ux-engine**
  (diseñar wireframe/spec antes de codear con `ux-design`, revisar con `ux-review`)
  y las skills de diseño frontend (`design-taste-frontend`, `high-end-visual-design`).
  Diseñar la UI **antes** de implementarla.

## Normas de código (clean code)

Aplican a todo el código nuevo. El formateo lo garantiza **Prettier**; estas normas
cubren estructura y estilo que Prettier no impone.

**Estructura / archivos**

- Un archivo, una responsabilidad. Extraer a archivos propios los errores, utilidades,
  constantes y cualquier cosa que no sea la función principal del archivo.
- Errores en `src/server/errors/` (una clase por archivo, barrel en `index.ts`).
- Validaciones divididas por unidad (`src/server/validation/{mac,ip,device}.ts`).
- Constantes/metadata de presentación del front en `src/lib/` (p. ej. `device-status.ts`).

**Control de flujo**

- `if` en una sola línea SOLO cuando el cuerpo es un `return` (guard clause):
  `if (!value) return null`.
- Cualquier otro `if` con cuerpo, `else`, `for` y bucles: siempre en bloque multilínea
  con llaves. Nunca en una sola línea.
- Preferir guard clauses y salidas tempranas frente al anidamiento.

**Objetos**

- Objetos literales nunca en una sola línea: una propiedad por línea, con trailing comma.

**Front (Astro + Preact)**

- Componentes atómicos: una única responsabilidad y la lógica mínima en cada uno.
- Toda la lógica de estado de las islas Preact (`useState`, `useEffect`, etc.) se extrae
  a **custom hooks** (`useXxx`) para mantener el componente declarativo.

**Formateo**

- Prettier 3 con `prettier-plugin-astro` y `prettier-plugin-tailwindcss`. Config en
  `.prettierrc` (4 espacios, sin `;`, comillas simples, `trailingComma: all`, printWidth 120).
- Ejecutar `npx prettier --write` al terminar cualquier cambio.

## Stack

- **Astro 7** (`^7.1.6`) con **SSR** para toda la lógica de backend.
- **Preact 10** (`@astrojs/preact`) para los componentes interactivos (islas).
  JSX configurado con `jsxImportSource: "preact"`.
- **Tailwind CSS 4** vía `@tailwindcss/vite` (no PostCSS, no `tailwind.config`
  clásico; configuración con `@theme` en CSS).
- **Node 22+** (`engines.node >= 22.12.0`).
- Adaptador SSR: **`@astrojs/node`** en modo `standalone` (ya configurado con
  `output: 'server'` en `astro.config.mjs`). El acceso a la red local (UDP broadcast,
  sockets) requiere que el backend corra en Node en el servidor, no en edge.
- **Prettier** con plugins de Astro y Tailwind para el formateo (ver "Normas de código").

## Arquitectura

```
Navegador (Preact islands)
      │  fetch()
      ▼
Endpoints SSR de Astro (src/pages/api/*.ts)   ← toda la lógica de red vive aquí
      │
      ├─ Wake-on-LAN: envío de "magic packet" (UDP broadcast, módulo `dgram`)
      ├─ Detección de estado: sondeo TCP + ping ICMP
      └─ Persistencia: lectura/escritura del JSON de equipos
```

- La lógica de red (WoL, detección) **solo** se ejecuta en el servidor (SSR).
  Nunca en el cliente.
- Los componentes Preact son islas hidratadas que llaman a los endpoints por `fetch`.

## Modelo de datos

Almacenamiento en un único fichero JSON (p. ej. `data/devices.json`), montado como
volumen en Docker para que persista.

```jsonc
{
  "devices": [
    {
      "id": "uuid",
      "name": "PC-Salon",       // nombre del equipo (mostrado en la card)
      "mac": "AA:BB:CC:DD:EE:FF",// OBLIGATORIO: el magic packet se dirige a la MAC
      "ip": "192.168.1.42"       // opcional: solo para detección de estado
    }
  ]
}
```

> Nota técnica: Wake-on-LAN **requiere la MAC**, no la IP. El magic packet se envía
> por broadcast a la MAC del equipo. La IP es opcional y solo se usa para detectar si
> está encendido.

## Funcionalidades

### 1. Lista de equipos (cards)
- UI con **cards**, cada una muestra: nombre del equipo, IP y su estado
  (encendido / apagado / comprobando).
- Acciones por card: **Encender** (WoL) y (según diseño) editar / eliminar.
- CRUD de equipos: añadir, editar y borrar (persiste en el JSON).

### 2. Encender (Wake-on-LAN)
- Endpoint SSR que construye y envía el magic packet por UDP broadcast (`dgram`),
  puerto 9 (o 7). Sin dependencias externas obligatorias.
- **No existe apagar.** Decisión de diseño: WoL solo puede *encender*. Apagar un PC
  remoto exige un mecanismo en el propio equipo (credenciales + RPC/WMI en Windows o
  SSH en Linux), lo que contradice el requisito de "no modificar nada en los PCs".
  Por eso la app es solo de encendido + monitorización.

### 3. Detección de estado (sin instalar nada en los PCs)
- Estrategia **combinada TCP + ICMP**: se considera *encendido* si responde por
  cualquiera de los dos.
  - **Sondeo TCP**: intento de conexión a puertos comunes (445 SMB, 3389 RDP, 22
    SSH...). Fiable en contenedores sin privilegios.
  - **Ping ICMP**: complementa cuando el equipo no expone puertos TCP.
- Ejecutado en el backend SSR, con timeouts cortos. Refresco periódico desde la UI.

## UI / Estilo

- Estética **minimalista y moderna**, con efectos de **borde tipo neón** en las cards.
- Tailwind 4 para todo el estilado. Definir tokens (colores neón, radios, sombras/glow)
  con `@theme` en el CSS global.
- Diseñar el layout y estados (loading, vacío, error, encendido/apagado) **antes** de
  implementar, usando ux-engine. Cubrir todos los estados de cada card.

## Desarrollo

Arrancar el servidor de desarrollo en segundo plano:

```
astro dev --background
```

Gestionar el servidor con `astro dev stop`, `astro dev status` y `astro dev logs`.

## Docker

App **dockerizada** con build **multi-stage** y tres perfiles: **dev**, **staging** y
**prod**.

- Build multi-stage: etapa de dependencias → build de Astro → imagen final de runtime
  ligera con Node 22 (solo `dist/` + `node_modules` de producción).
- El servidor SSR corre con el adaptador `@astrojs/node` (standalone).
- El JSON de datos se monta como **volumen** para que persista entre despliegues.
- Consideraciones de red para WoL/ICMP en contenedor: el broadcast UDP y el ping ICMP
  pueden requerir `network_mode: host` o capacidad `NET_RAW` / `NET_ADMIN` según el
  entorno. Documentar en el compose de cada perfil.

## Documentación

Documentación completa: https://docs.astro.build

Consultar estas guías antes de trabajar en tareas relacionadas:

- [Añadir páginas, rutas dinámicas o middleware](https://docs.astro.build/en/guides/routing/)
- [Trabajar con componentes Astro](https://docs.astro.build/en/basics/astro-components/)
- [Usar componentes de framework (React, Preact, etc.)](https://docs.astro.build/en/guides/framework-components/)
- [Renderizado bajo demanda / SSR y adaptadores](https://docs.astro.build/en/guides/on-demand-rendering/)
- [Endpoints (API routes)](https://docs.astro.build/en/guides/endpoints/)
- [Añadir estilos o usar Tailwind](https://docs.astro.build/en/guides/styling/)
