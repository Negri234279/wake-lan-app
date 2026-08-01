import type { DeviceStatus } from '../server/types'
import { STATUS_META } from '../lib/device-status'

interface Props {
    status: DeviceStatus
}

/** Indicador de estado: glifo + etiqueta (nunca solo color, por accesibilidad). */
export function StatusPill({ status }: Props) {
    const meta = STATUS_META[status]

    return (
        <span class={`flex items-center gap-1.5 text-xs font-medium ${meta.color}`}>
            <span aria-hidden="true">{meta.glyph}</span>
            {meta.label}
        </span>
    )
}
