import type { Device, DeviceStatus } from '../server/types'
import { DeviceCard } from './DeviceCard'

interface Props {
    devices: Device[]
    statusFor: (device: Device) => DeviceStatus
    bootElapsedFor: (device: Device) => string | undefined
    onWake: (device: Device) => void
    onEdit: (device: Device) => void
    onDelete: (device: Device) => void
}

/** Rejilla responsive de cards. */
export function DeviceGrid({ devices, statusFor, bootElapsedFor, onWake, onEdit, onDelete }: Props) {
    return (
        <section class="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {devices.map((device) => (
                <DeviceCard
                    key={device.id}
                    device={device}
                    status={statusFor(device)}
                    bootElapsed={bootElapsedFor(device)}
                    onWake={() => onWake(device)}
                    onEdit={() => onEdit(device)}
                    onDelete={() => onDelete(device)}
                />
            ))}
        </section>
    )
}
