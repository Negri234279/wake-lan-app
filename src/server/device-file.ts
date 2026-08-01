import { mkdir, readFile, rename, writeFile } from 'node:fs/promises'
import { dirname } from 'node:path'

import type { Device } from './types'

/** Ruta del JSON de datos. Configurable por env para el volumen de Docker. */
const DATA_FILE = process.env.DATA_FILE ?? './data/devices.json'

/** Lee todos los equipos del JSON. Devuelve lista vacía si el fichero no existe. */
export async function readDevicesFile(): Promise<Device[]> {
    try {
        const raw = await readFile(DATA_FILE, 'utf8')
        const parsed = JSON.parse(raw) as { devices?: Device[] }

        if (!Array.isArray(parsed.devices)) {
            return []
        }

        return parsed.devices
    } catch (error) {
        if (isFileNotFound(error)) {
            return []
        }

        throw error
    }
}

/** Escribe la lista completa de equipos de forma atómica (temporal + rename). */
export async function writeDevicesFile(devices: Device[]): Promise<void> {
    await mkdir(dirname(DATA_FILE), { recursive: true })

    const payload = {
        devices,
    }
    const tmp = `${DATA_FILE}.tmp`

    await writeFile(tmp, `${JSON.stringify(payload, null, 2)}\n`, 'utf8')
    await rename(tmp, DATA_FILE)
}

function isFileNotFound(error: unknown): boolean {
    return (error as NodeJS.ErrnoException).code === 'ENOENT'
}
