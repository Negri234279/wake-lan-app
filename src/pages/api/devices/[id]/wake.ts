import type { APIRoute } from 'astro'

import { getDevice } from '../../../../server/store'
import { NotFoundError } from '../../../../server/errors'
import { errorResponse, json, requireId } from '../../../../server/http'
import { wake } from '../../../../server/wol'

/** POST /api/devices/:id/wake — envía el magic packet de Wake-on-LAN. */
export const POST: APIRoute = async ({ params }) => {
    try {
        const id = requireId(params.id)
        const device = await getDevice(id)

        if (!device) {
            throw new NotFoundError(id)
        }

        await wake(device.mac)

        return json({
            ok: true,
        })
    } catch (error) {
        return errorResponse(error)
    }
}
