import type { APIRoute } from 'astro'

import type { DeviceStatusEntry } from '../../../../server/types'
import { getDevice } from '../../../../server/store'
import { NotFoundError } from '../../../../server/errors'
import { errorResponse, json, requireId } from '../../../../server/http'
import { resolveDeviceStatus } from '../../../../server/status'

/** GET /api/devices/:id/status — sondea el estado de un equipo. */
export const GET: APIRoute = async ({ params }) => {
    try {
        const id = requireId(params.id)
        const device = await getDevice(id)

        if (!device) {
            throw new NotFoundError(id)
        }

        const entry: DeviceStatusEntry = {
            id: device.id,
            status: await resolveDeviceStatus(device),
        }

        return json(entry)
    } catch (error) {
        return errorResponse(error)
    }
}
