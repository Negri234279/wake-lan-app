import { useCallback, useEffect, useRef, useState } from 'preact/hooks'

import type { Device, DeviceStatus } from '../server/types'
import { fetchDeviceStatus } from '../lib/api'

const POLL_INTERVAL_MS = 12000

export type StatusMap = Record<string, DeviceStatus>

/**
 * Sondea el estado de la flota cada `POLL_INTERVAL_MS` y bajo demanda, pero de
 * forma INDEPENDIENTE por equipo: cada card se actualiza en cuanto llega su
 * propia respuesta, sin esperar al resto. Se pausa con la pestaña oculta.
 */
export function useStatusPolling(devices: Device[]) {
    const [statuses, setStatuses] = useState<StatusMap>({})
    const [checking, setChecking] = useState(false)
    const [failed, setFailed] = useState(false)

    // Ref para que `poll` (identidad estable) lea siempre la lista actual.
    const devicesRef = useRef(devices)
    devicesRef.current = devices

    const pollOne = useCallback(async (id: string): Promise<boolean> => {
        try {
            const entry = await fetchDeviceStatus(id)

            setStatuses((current) => ({
                ...current,
                [id]: entry.status,
            }))

            return true
        } catch {
            return false
        }
    }, [])

    const poll = useCallback(async () => {
        const list = devicesRef.current

        if (list.length === 0) {
            setChecking(false)
            return
        }

        setChecking(true)

        const results = await Promise.all(list.map((device) => pollOne(device.id)))

        setChecking(false)
        
        setFailed(results.every((ok) => !ok))
    }, [pollOne])

    useEffect(() => {
        poll()

        const timer = setInterval(() => {
            if (document.hidden) return

            poll()
        }, POLL_INTERVAL_MS)

        return () => clearInterval(timer)
    }, [poll])

    return {
        statuses,
        checking,
        failed,
        poll,
    }
}
