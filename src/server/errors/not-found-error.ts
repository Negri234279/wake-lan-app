/** Error de recurso no encontrado. Los endpoints lo mapean a 404. */
export class NotFoundError extends Error {
    constructor(id: string) {
        super(`Device not found: ${id}`)
        this.name = 'NotFoundError'
    }
}
