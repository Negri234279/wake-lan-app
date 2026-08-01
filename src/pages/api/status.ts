import type { APIRoute } from 'astro'

import type { Device, DeviceStatusEntry } from '../../server/types'
import { listDevices } from '../../server/store'
import { errorResponse, json } from '../../server/http'
import { resolveDeviceStatus } from '../../server/status'

/** GET /api/status — sondea el estado de todos los equipos en paralelo. */
export const GET: APIRoute = async () => {
    try {
        const devices = await listDevices()
        const statuses = await Promise.all(devices.map(toStatusEntry))

        return json(statuses)
    } catch (error) {
        return errorResponse(error)
    }
}

async function toStatusEntry(device: Device): Promise<DeviceStatusEntry> {
    return {
        id: device.id,
        status: await resolveDeviceStatus(device),
    }
}
