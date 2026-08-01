import { useCallback, useState } from 'preact/hooks'

import type { Device, DeviceInput } from '../server/types'
import * as api from '../lib/api'

export type LoadState = 'ready' | 'loading' | 'error'

/**
 * Estado y operaciones CRUD de la lista de equipos. Arranca con los datos que
 * inyecta el SSR, así que no hay parpadeo de carga en el primer render.
 */
export function useDevices(initial: Device[]) {
    const [devices, setDevices] = useState<Device[]>(initial)
    const [loadState, setLoadState] = useState<LoadState>('ready')

    const reload = useCallback(async () => {
        setLoadState('loading')

        try {
            setDevices(await api.fetchDevices())
            setLoadState('ready')
        } catch {
            setLoadState('error')
        }
    }, [])

    const create = useCallback(async (input: DeviceInput) => {
        const device = await api.createDevice(input)
        setDevices((current) => [...current, device])

        return device
    }, [])

    const update = useCallback(async (id: string, input: DeviceInput) => {
        const device = await api.updateDevice(id, input)
        setDevices((current) => current.map((item) => (item.id === id ? device : item)))

        return device
    }, [])

    const remove = useCallback(async (id: string) => {
        await api.deleteDevice(id)
        setDevices((current) => current.filter((item) => item.id !== id))
    }, [])

    return {
        devices,
        loadState,
        reload,
        create,
        update,
        remove,
    }
}
