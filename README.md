# WakeLAN

Web app to **wake computers on the local network via Wake-on-LAN** and see at a glance which
ones are on. Minimalist, modern UI (dark theme with neon accents), meant for home / lab use,
with minimal storage in a JSON file.

## Features

- **Device list** as cards showing name, IP and **live status** (on / off / checking /
  booting / unknown).
- **Wake via Wake-on-LAN**: sends the _magic packet_ over UDP broadcast.
- **Status detection without installing anything** on the PCs: combined **TCP + ICMP** probe
  with _early-out_ (resolves as soon as either responds) and **per-card independent** updates
  (each device refreshes without waiting for the others).
- **Device management**: add, edit and delete (with confirmation).
- **SSR** for all network logic; **Preact islands** for interactivity.

> **Note:** Wake-on-LAN can only **turn machines on**. Powering off a remote machine would
> require installing something on it (credentials + RPC/WMI or SSH), so the app is wake +
> monitoring only. The _magic packet_ targets the **MAC**, which is therefore required.

## Stack

- [Astro 7](https://astro.build) in **SSR** mode with the `@astrojs/node` adapter (standalone).
- [Preact 10](https://preactjs.com) for the interactive components.
- [Tailwind CSS 4](https://tailwindcss.com) (via `@tailwindcss/vite`).
- Node.js **22+**. Persistence in a JSON file.

## Requirements

- Node.js `>= 22.12.0` (for local development), or **Docker** (for deployment).
- For WoL and ICMP to reach the LAN, the deployment uses the **host network** (see Docker).

## Getting started (development)

```sh
npm install
npm run dev          # http://localhost:4321
```

## Docker

Multi-stage `Dockerfile` + `docker-compose.yml` with three profiles:

```sh
docker compose --profile dev up --build          # development (hot reload)
docker compose --profile staging up --build -d    # staging  (port 4322)
docker compose --profile prod up --build -d        # production (port 4321)
```

Or with the npm shortcuts: `npm run docker:dev`, `npm run docker:staging`, `npm run docker:prod`.

- **`network_mode: host`** is required so the Wake-on-LAN UDP broadcast and the ICMP ping
  reach the real LAN. It needs a **Linux host** (on Docker Desktop for Windows/Mac the host
  network is limited).
- Data persists in the **`/data`** volume (one per profile).

## Configuration (environment variables)

| Variable    | Default               | Description                        |
| ----------- | --------------------- | ---------------------------------- |
| `DATA_FILE` | `./data/devices.json` | Path to the devices JSON file.     |
| `HOST`      | `localhost`           | SSR server listen interface.       |
| `PORT`      | `4321`                | SSR server port.                   |

## Data model

Each device is stored in `data/devices.json`:

```jsonc
{
    "devices": [
        {
            "id": "uuid",
            "name": "Servidor-NAS", // display name
            "mac": "AA:BB:CC:DD:EE:FF", // REQUIRED (WoL targets the MAC)
            "ip": "192.168.1.10" // optional, only used for status probing
        }
    ]
}
```

## API (SSR)

All routes return JSON. Mutating methods are protected by Astro's `checkOrigin` (the app's
own `fetch`, being same-origin, satisfies it automatically).

| Method | Route                     | Description                          |
| ------ | ------------------------- | ------------------------------------ |
| GET    | `/api/devices`            | List devices.                        |
| POST   | `/api/devices`            | Create a device.                     |
| PATCH  | `/api/devices/:id`        | Edit a device.                       |
| DELETE | `/api/devices/:id`        | Delete a device.                     |
| POST   | `/api/devices/:id/wake`   | Send the magic packet (Wake-on-LAN). |
| GET    | `/api/devices/:id/status` | Status of a single device.           |
| GET    | `/api/status`             | Status of the whole fleet.           |

## Project structure

```text
src/
├── pages/
│   ├── index.astro          # initial SSR load + Dashboard island
│   └── api/                 # SSR endpoints (devices, wake, status)
├── components/              # Preact components (Dashboard, DeviceCard, modals…)
├── hooks/                   # custom hooks (state: devices, polling, wake, toasts…)
├── lib/                     # API client, status metadata, utilities
├── layouts/Layout.astro     # base layout (dark theme)
├── styles/global.css        # Tailwind 4 + @theme tokens (neon)
└── server/                  # backend logic
    ├── store.ts             # CRUD over the JSON (+ lock, atomic writes)
    ├── validation/          # MAC/IP normalization, device validation
    ├── wol/                 # magic packet + UDP send
    ├── status/              # TCP + ICMP probing and status resolution
    ├── http/                # response and error helpers
    └── errors/              # typed errors (ValidationError, NotFoundError)
```

## Commands

| Command            | Action                                            |
| ------------------ | ------------------------------------------------- |
| `npm run dev`      | Development server at `localhost:4321`.           |
| `npm run build`    | Production build to `./dist/`.                    |
| `npm start`        | Run the built SSR server.                         |
| `npm run format`   | Format the code with Prettier.                    |
| `npm run docker:*` | Bring up a Docker profile (`dev`/`staging`/`prod`). |
