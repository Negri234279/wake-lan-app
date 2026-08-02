import { NotFoundError, ValidationError } from '../errors'
import { json } from './json'

/** Mapea errores conocidos a respuestas HTTP; cualquier otro → 500. */
export function errorResponse(error: unknown): Response {
    if (error instanceof ValidationError) {
        return json(
            {
                error: error.message,
                fields: error.fields,
            },
            400,
        )
    }

    if (error instanceof NotFoundError) {
        return json(
            {
                error: error.message,
            },
            404,
        )
    }

    console.error('Unhandled API error:', error)

    return json(
        {
            error: 'Internal server error.',
        },
        500,
    )
}
