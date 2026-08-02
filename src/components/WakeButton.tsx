import type { DeviceStatus } from '../server/types'

interface Props {
    status: DeviceStatus
    onWake: () => void
}

/**
 * Acción de encender. Es un botón de disparo, NUNCA un toggle: cuando el equipo
 * está encendido se muestra deshabilitado (no hay forma de apagar por WoL).
 */
export function WakeButton({ status, onWake }: Props) {
    if (status === 'encendido') {
        return (
            <button
                disabled
                aria-disabled="true"
                class="border-on/30 bg-on/5 text-on/70 w-full cursor-default rounded-lg border px-4 py-2 text-sm font-medium"
            >
                ✓ On
            </button>
        )
    }

    if (status === 'arrancando') {
        return (
            <button
                onClick={onWake}
                class="border-border text-text-muted hover:text-text w-full rounded-lg border px-4 py-2 text-sm transition"
            >
                Retry
            </button>
        )
    }

    return (
        <button
            onClick={onWake}
            class="border-boot/40 bg-boot/10 text-boot hover:bg-boot/20 hover:shadow-glow-boot w-full rounded-lg border px-4 py-2 text-sm font-medium transition"
        >
            ⚡ Wake
        </button>
    )
}
