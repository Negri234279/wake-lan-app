import { randomUUID } from 'node:crypto'

import type { Device, DeviceInput } from './types'
import { NotFoundError, ValidationError } from './errors'
import { createLock } from './lock'
import { readDevicesFile, writeDevicesFile } from './device-file'
import { validateDeviceInput, type CleanDeviceInput } from './validation'

// Serializa el CRUD para no corromper el JSON con escrituras concurrentes.
const withLock = createLock()

/** Lista todos los equipos. */
export function listDevices(): Promise<Device[]> {
    return withLock(readDevicesFile)
}

/** Devuelve un equipo por id, o `null` si no existe. */
export function getDevice(id: string): Promise<Device | null> {
    return withLock(async () => {
        const devices = await readDevicesFile()

        return devices.find((device) => device.id === id) ?? null
    })
}

/** Crea un equipo. Lanza `ValidationError` si los datos no son válidos. */
export function addDevice(input: DeviceInput): Promise<Device> {
    return withLock(async () => {
        const values = toCleanInput(input)
        const devices = await readDevicesFile()
        const device: Device = {
            id: randomUUID(),
            ...values,
        }

        devices.push(device)
        await writeDevicesFile(devices)

        return device
    })
}

/**
 * Actualiza un equipo existente. Lanza `NotFoundError` si no existe
 * y `ValidationError` si los datos no son válidos.
 */
export function updateDevice(id: string, input: DeviceInput): Promise<Device> {
    return withLock(async () => {
        const values = toCleanInput(input)
        const devices = await readDevicesFile()
        const index = devices.findIndex((device) => device.id === id)

        if (index === -1) {
            throw new NotFoundError(id)
        }

        const updated: Device = {
            id,
            ...values,
        }

        devices[index] = updated
        await writeDevicesFile(devices)

        return updated
    })
}

/** Elimina un equipo. Lanza `NotFoundError` si no existe. */
export function deleteDevice(id: string): Promise<void> {
    return withLock(async () => {
        const devices = await readDevicesFile()
        const index = devices.findIndex((device) => device.id === id)

        if (index === -1) {
            throw new NotFoundError(id)
        }

        devices.splice(index, 1)
        await writeDevicesFile(devices)
    })
}

function toCleanInput(input: DeviceInput): CleanDeviceInput {
    const { values, errors } = validateDeviceInput(input)

    if (!values) {
        throw new ValidationError(errors ?? {})
    }

    return values
}
