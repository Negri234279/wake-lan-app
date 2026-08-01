import { useCallback, useState } from 'preact/hooks'

export type ToastTone = 'info' | 'success' | 'error'

export interface Toast {
    id: number
    tone: ToastTone
    message: string
}

const AUTO_DISMISS_MS = 4000

let nextId = 0

/** Gestiona la cola de toasts (feedback transitorio) con auto-descarte. */
export function useToasts() {
    const [toasts, setToasts] = useState<Toast[]>([])

    const dismiss = useCallback((id: number) => {
        setToasts((current) => current.filter((toast) => toast.id !== id))
    }, [])

    const notify = useCallback(
        (tone: ToastTone, message: string) => {
            const toast: Toast = {
                id: nextId++,
                tone,
                message,
            }

            setToasts((current) => [...current, toast])
            setTimeout(() => dismiss(toast.id), AUTO_DISMISS_MS)
        },
        [dismiss],
    )

    return {
        toasts,
        notify,
        dismiss,
    }
}
