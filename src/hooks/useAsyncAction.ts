import { useCallback, useState } from 'preact/hooks'

/**
 * Ejecuta una acción asíncrona rastreando su estado pendiente y su error, para
 * botones de envío (guardar, eliminar). Devuelve `true` si la acción tuvo éxito.
 */
export function useAsyncAction() {
    const [pending, setPending] = useState(false)
    const [error, setError] = useState<string | null>(null)

    const run = useCallback(async (action: () => Promise<void>): Promise<boolean> => {
        setPending(true)
        setError(null)

        try {
            await action()

            return true
        } catch (caught) {
            setError(messageOf(caught))

            return false
        } finally {
            setPending(false)
        }
    }, [])

    return {
        pending,
        error,
        setError,
        run,
    }
}

function messageOf(error: unknown): string {
    if (error instanceof Error) return error.message

    return 'Error inesperado'
}
