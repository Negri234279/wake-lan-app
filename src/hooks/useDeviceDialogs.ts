import { useState } from 'preact/hooks'

import type { Device } from '../server/types'

/** Diálogo abierto en el dashboard: ninguno, alta, edición o borrado. */
export type DeviceDialog =
    { kind: 'none' } | { kind: 'add' } | { kind: 'edit'; device: Device } | { kind: 'delete'; device: Device }

/** Orquesta qué modal está abierto y sobre qué equipo. */
export function useDeviceDialogs() {
    const [dialog, setDialog] = useState<DeviceDialog>({ kind: 'none' })

    const openAdd = () => {
        setDialog({
            kind: 'add',
        })
    }

    const openEdit = (device: Device) => {
        setDialog({
            kind: 'edit',
            device,
        })
    }

    const openDelete = (device: Device) => {
        setDialog({
            kind: 'delete',
            device,
        })
    }

    const close = () => {
        setDialog({
            kind: 'none',
        })
    }

    return {
        dialog,
        openAdd,
        openEdit,
        openDelete,
        close,
    }
}
