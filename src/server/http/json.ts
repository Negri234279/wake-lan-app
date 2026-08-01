/** Respuesta JSON con el código de estado indicado. */
export function json(data: unknown, status = 200): Response {
    return new Response(JSON.stringify(data), {
        status,
        headers: {
            'content-type': 'application/json; charset=utf-8',
        },
    })
}

/** Respuesta 204 sin contenido. */
export function noContent(): Response {
    return new Response(null, {
        status: 204,
    })
}
