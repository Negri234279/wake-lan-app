/** Tarea asíncrona serializable por el lock. */
type Task<T> = () => Promise<T>

/** Ejecuta tareas en exclusión mutua, respetando el orden de llegada. */
export type WithLock = <T>(task: Task<T>) => Promise<T>

/**
 * Crea un mutex simple basado en una cola de promesas. Serializa las operaciones
 * para que no se solapen (p. ej. lectura → modificación → escritura de un fichero).
 */
export function createLock(): WithLock {
    let queue: Promise<unknown> = Promise.resolve()

    return function withLock<T>(task: Task<T>): Promise<T> {
        const run = queue.then(task, task)

        // La cola nunca debe quedar "rechazada" o bloquearía las siguientes tareas.
        queue = run.then(
            () => undefined,
            () => undefined,
        )

        return run
    }
}
