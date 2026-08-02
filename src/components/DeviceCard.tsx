import type { Device, DeviceStatus } from '../server/types'
import { STATUS_META } from '../lib/device-status'
import { StatusPill } from './StatusPill'
import { WakeButton } from './WakeButton'
import { OverflowMenu } from './OverflowMenu'

interface Props {
    device: Device
    status: DeviceStatus
    bootElapsed?: string
    onWake: () => void
    onEdit: () => void
    onDelete: () => void
}

/** Card de un equipo: estado, identidad y acciones. */
export function DeviceCard({ device, status, bootElapsed, onWake, onEdit, onDelete }: Props) {
    const meta = STATUS_META[status]
    const isBooting = status === 'arrancando'
    const isUnknown = status === 'desconocido'

    return (
        <article
            class={`bg-surface relative flex flex-col rounded-[var(--radius-card)] border p-5 transition ${meta.glow}`}
        >
            <div class="flex items-center justify-between">
                <StatusPill status={status} />
                <OverflowMenu deviceName={device.name} onEdit={onEdit} onDelete={onDelete} />
            </div>

            <h3 class="text-text mt-3 text-base font-semibold">{device.name}</h3>
            <p class="text-text-muted mt-0.5 font-mono text-sm">{device.ip ?? 'No IP'}</p>

            {isBooting ? (
                <p class="text-boot mt-0.5 font-mono text-xs">Packet sent · {bootElapsed} · waiting</p>
            ) : (
                <p class="text-text-muted/60 mt-0.5 font-mono text-xs">{device.mac}</p>
            )}

            <div class="mt-4">
                <WakeButton status={status} onWake={onWake} />
            </div>

            {isUnknown && <p class="text-unknown mt-2 text-xs">Status can't be checked</p>}
        </article>
    )
}
