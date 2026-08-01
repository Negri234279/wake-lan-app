import type { Toast, ToastTone } from '../hooks/useToasts'

interface Props {
    toasts: Toast[]
    onDismiss: (id: number) => void
}

const TONE_CLASS: Record<ToastTone, string> = {
    info: 'border-border text-text',
    success: 'border-on/50 text-on',
    error: 'border-danger/50 text-danger',
}

/** Región de avisos transitorios (feedback de acciones). */
export function Toaster({ toasts, onDismiss }: Props) {
    return (
        <div class="fixed right-4 bottom-4 z-50 flex flex-col gap-2" aria-live="polite">
            {toasts.map((toast) => (
                <button
                    key={toast.id}
                    onClick={() => onDismiss(toast.id)}
                    class={`bg-surface-2 max-w-xs rounded-lg border px-4 py-2 text-left text-sm shadow-xl ${TONE_CLASS[toast.tone]}`}
                >
                    {toast.message}
                </button>
            ))}
        </div>
    )
}
