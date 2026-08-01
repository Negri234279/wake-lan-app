import type { APIRoute } from 'astro'

import type { DeviceInput } from '../../../server/types'
import { addDevice, listDevices } from '../../../server/store'
import { errorResponse, json, readJsonBody } from '../../../server/http'

/** GET /api/devices — lista todos los equipos. */
export const GET: APIRoute = async () => {
    const devices = await listDevices()

    return json(devices)
}

/** POST /api/devices — crea un equipo. */
export const POST: APIRoute = async ({ request }) => {
    try {
        const body = (await readJsonBody(request)) as DeviceInput | null
        const device = await addDevice(body ?? ({} as DeviceInput))

        return json(device, 201)
    } catch (error) {
        return errorResponse(error)
    }
}
