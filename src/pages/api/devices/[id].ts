import type { APIRoute } from 'astro'

import type { DeviceInput } from '../../../server/types'
import { deleteDevice, updateDevice } from '../../../server/store'
import { errorResponse, json, noContent, readJsonBody, requireId } from '../../../server/http'

/** PATCH /api/devices/:id — actualiza un equipo. */
export const PATCH: APIRoute = async ({ params, request }) => {
    try {
        const id = requireId(params.id)
        const body = (await readJsonBody(request)) as DeviceInput | null
        const device = await updateDevice(id, body ?? ({} as DeviceInput))

        return json(device)
    } catch (error) {
        return errorResponse(error)
    }
}

/** DELETE /api/devices/:id — elimina un equipo. */
export const DELETE: APIRoute = async ({ params }) => {
    try {
        const id = requireId(params.id)
        await deleteDevice(id)

        return noContent()
    } catch (error) {
        return errorResponse(error)
    }
}
