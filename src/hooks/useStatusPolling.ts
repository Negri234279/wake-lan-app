import { useCallback, useEffect, useState } from 'preact/hooks'

import type { DeviceStatus, DeviceStatusEntry } from '../server/types'
import { fetchFleetStatus } from '../lib/api'

const POLL_INTERVAL_MS = 12000

export type StatusMap = Record<string, DeviceStatus>

/**
 * Sondea el estado de toda la flota cada `POLL_INTERVAL_MS` y bajo demanda.
 * Se pausa cuando la pestaña está oculta para no malgastar sondeos.
 */
export function useStatusPolling() {
    const [statuses, setStatuses] = useState<StatusMap>({})
    const [checking, setChecking] = useState(false)
    const [failed, setFailed] = useState(false)

    const poll = useCallback(async () => {
        setChecking(true)

        try {
            const entries = await fetchFleetStatus()
            setStatuses(toStatusMap(entries))
            setFailed(false)
        } catch {
            setFailed(true)
        } finally {
            setChecking(false)
        }
    }, [])

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

function toStatusMap(entries: DeviceStatusEntry[]): StatusMap {
    const map: StatusMap = {}

    for (const entry of entries) {
        map[entry.id] = entry.status
    }

    return map
}
