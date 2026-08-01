import { useEffect } from 'preact/hooks'

import type { Device, DeviceInput, DeviceStatus } from '../server/types'
import { resolveDisplayStatus } from '../lib/device-status'
import { wakeDevice } from '../lib/api'
import { useDevices } from '../hooks/useDevices'
import { useStatusPolling } from '../hooks/useStatusPolling'
import { useWake } from '../hooks/useWake'
import { useToasts } from '../hooks/useToasts'
import { useDeviceDialogs } from '../hooks/useDeviceDialogs'
import { AppHeader } from './AppHeader'
import { DashboardSummary } from './DashboardSummary'
import { DeviceGrid } from './DeviceGrid'
import { EmptyState } from './EmptyState'
import { ErrorBanner } from './ErrorBanner'
import { DeviceFormModal } from './DeviceFormModal'
import { ConfirmDeleteModal } from './ConfirmDeleteModal'
import { Toaster } from './Toaster'

interface Props {
    initialDevices: Device[]
}

/** Isla raíz del dashboard: orquesta datos, sondeo, wake y diálogos. */
export function Dashboard({ initialDevices }: Props) {
    const devices = useDevices(initialDevices)
    const polling = useStatusPolling(devices.devices)
    const wake = useWake()
    const toasts = useToasts()
    const dialogs = useDeviceDialogs()

    // Deja de "esperar arranque" cuando el sondeo confirma que ya está encendido.
    useEffect(() => {
        for (const id of Object.keys(wake.booting)) {
            if (polling.statuses[id] === 'encendido') {
                wake.stopBooting(id)
            }
        }
    }, [polling.statuses])

    const statusFor = (device: Device): DeviceStatus => {
        return resolveDisplayStatus(polling.statuses[device.id], Boolean(wake.booting[device.id]))
    }

    const bootElapsedFor = (device: Device): string | undefined => {
        return wake.booting[device.id]?.elapsed
    }

    const handleWake = async (device: Device) => {
        try {
            await wakeDevice(device.id)
            toasts.notify('success', `Magic packet enviado a ${device.name}`)
            wake.startBooting(device.id)
            polling.poll()
        } catch {
            toasts.notify('error', `No se pudo encender ${device.name}`)
        }
    }

    const handleRefresh = () => {
        devices.reload()
        polling.poll()
    }

    const handleCreate = async (input: DeviceInput) => {
        await devices.create(input)
        toasts.notify('success', 'Equipo añadido')
        polling.poll()
    }

    const handleEditSubmit = (device: Device) => async (input: DeviceInput) => {
        await devices.update(device.id, input)
        toasts.notify('success', 'Equipo actualizado')
        polling.poll()
    }

    const handleDeleteConfirm = (device: Device) => async () => {
        await devices.remove(device.id)
        toasts.notify('info', `«${device.name}» eliminado`)
    }

    const onCount = devices.devices.filter((device) => statusFor(device) === 'encendido').length
    const offCount = devices.devices.filter((device) => statusFor(device) === 'apagado').length
    const isEmpty = devices.devices.length === 0

    return (
        <>
            <AppHeader
                onRefresh={handleRefresh}
                onAdd={dialogs.openAdd}
                isRefreshing={polling.checking || devices.loadState === 'loading'}
            />

            {polling.failed && (
                <ErrorBanner
                    message="No se pudo contactar con el servidor. Los estados no están actualizados."
                    onRetry={handleRefresh}
                />
            )}

            <DashboardSummary onCount={onCount} offCount={offCount} checking={polling.checking} />

            {isEmpty ? (
                <EmptyState onAdd={dialogs.openAdd} />
            ) : (
                <DeviceGrid
                    devices={devices.devices}
                    statusFor={statusFor}
                    bootElapsedFor={bootElapsedFor}
                    onWake={handleWake}
                    onEdit={dialogs.openEdit}
                    onDelete={dialogs.openDelete}
                />
            )}

            {dialogs.dialog.kind === 'add' && <DeviceFormModal onSubmit={handleCreate} onClose={dialogs.close} />}
            {dialogs.dialog.kind === 'edit' && (
                <DeviceFormModal
                    device={dialogs.dialog.device}
                    onSubmit={handleEditSubmit(dialogs.dialog.device)}
                    onClose={dialogs.close}
                />
            )}
            {dialogs.dialog.kind === 'delete' && (
                <ConfirmDeleteModal
                    deviceName={dialogs.dialog.device.name}
                    onConfirm={handleDeleteConfirm(dialogs.dialog.device)}
                    onClose={dialogs.close}
                />
            )}

            <Toaster toasts={toasts.toasts} onDismiss={toasts.dismiss} />
        </>
    )
}
