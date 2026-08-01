import { useCallback, useEffect, useState } from 'preact/hooks'

import { formatElapsed } from '../lib/format-elapsed'

/** Techo de la ventana de arranque: pasado este tiempo se deja de "esperar". */
const BOOT_CEILING_MS = 90000

export interface BootState {
    startedAt: number
    elapsed: string
}

export type BootMap = Record<string, BootState>

/**
 * Rastrea la ventana de arranque ("arrancando") tras enviar el WoL. Mantiene un
 * único intervalo que actualiza el contador y expira los equipos pasados el techo.
 */
export function useWake() {
    const [booting, setBooting] = useState<BootMap>({})
    const hasBooting = Object.keys(booting).length > 0

    useEffect(() => {
        if (!hasBooting) return

        const timer = setInterval(() => {
            setBooting(tickBoots)
        }, 1000)

        return () => clearInterval(timer)
    }, [hasBooting])

    const startBooting = useCallback((id: string) => {
        setBooting((current) => ({
            ...current,
            [id]: {
                startedAt: Date.now(),
                elapsed: '0:00',
            },
        }))
    }, [])

    const stopBooting = useCallback((id: string) => {
        setBooting((current) => removeKey(current, id))
    }, [])

    return {
        booting,
        startBooting,
        stopBooting,
    }
}

function tickBoots(current: BootMap): BootMap {
    const now = Date.now()
    const next: BootMap = {}

    for (const [id, boot] of Object.entries(current)) {
        const elapsedMs = now - boot.startedAt

        if (elapsedMs >= BOOT_CEILING_MS) {
            continue
        }

        next[id] = {
            startedAt: boot.startedAt,
            elapsed: formatElapsed(elapsedMs),
        }
    }

    return next
}

function removeKey(map: BootMap, id: string): BootMap {
    const next = {
        ...map,
    }

    delete next[id]

    return next
}
