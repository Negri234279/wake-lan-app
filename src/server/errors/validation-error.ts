import type { FieldErrors } from '../types'

/** Error de validación con detalle por campo. Los endpoints lo mapean a 400. */
export class ValidationError extends Error {
    readonly fields: FieldErrors

    constructor(fields: FieldErrors) {
        super('Invalid device data')
        this.name = 'ValidationError'
        this.fields = fields
    }
}
