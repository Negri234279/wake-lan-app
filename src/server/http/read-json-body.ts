/** Lee y parsea el body JSON de la petición. Devuelve `null` si no es válido. */
export async function readJsonBody(request: Request): Promise<unknown> {
    try {
        return await request.json()
    } catch {
        return null
    }
}
