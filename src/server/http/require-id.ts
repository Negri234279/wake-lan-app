import { NotFoundError } from '../errors'

/** Garantiza que el parámetro de ruta `id` existe; si no, lanza `NotFoundError`. */
export function requireId(id: string | undefined): string {
    if (!id) {
        throw new NotFoundError('(no id)')
    }

    return id
}
