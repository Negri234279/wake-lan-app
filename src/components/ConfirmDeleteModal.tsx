import { useAsyncAction } from '../hooks/useAsyncAction'
import { Modal } from './Modal'

interface Props {
    deviceName: string
    onConfirm: () => Promise<void>
    onClose: () => void
}

/** Confirmación de borrado (acción destructiva e irreversible). */
export function ConfirmDeleteModal({ deviceName, onConfirm, onClose }: Props) {
    const action = useAsyncAction()

    const handleConfirm = async () => {
        const ok = await action.run(onConfirm)

        if (ok) onClose()
    }

    return (
        <Modal title="Eliminar equipo" onClose={onClose}>
            <h2 class="text-lg font-semibold">Eliminar equipo</h2>
            <p class="text-text mt-3 text-sm">
                ¿Seguro que quieres eliminar «<span class="font-semibold">{deviceName}</span>»?
            </p>
            <p class="text-text-muted mt-1 text-sm">Esta acción no se puede deshacer.</p>

            {action.error && (
                <p class="text-danger mt-3 text-sm" role="alert">
                    ⚠ {action.error}
                </p>
            )}

            <div class="mt-6 flex justify-end gap-2">
                <button
                    onClick={onClose}
                    class="border-border text-text-muted hover:text-text rounded-lg border px-4 py-2 text-sm transition"
                >
                    Cancelar
                </button>
                <button
                    onClick={handleConfirm}
                    disabled={action.pending}
                    class="border-danger/50 bg-danger/10 text-danger hover:bg-danger/20 rounded-lg border px-4 py-2 text-sm font-medium transition disabled:opacity-60"
                >
                    {action.pending ? 'Eliminando…' : 'Eliminar'}
                </button>
            </div>
        </Modal>
    )
}
