import type { Device, DeviceStatus } from '../types'
import { PROBE_PORTS, PROBE_TIMEOUT_MS } from './config'
import { probeTcpPort } from './tcp'
import { probeIcmp } from './icmp'

/**
 * Determina si un host está alcanzable combinando sondeo TCP + ICMP.
 * Resuelve `true` en cuanto CUALQUIER sondeo responde (early-out), sin esperar
 * al resto; solo devuelve `false` cuando todos han fallado o expirado.
 */
export function isReachable(host: string, timeoutMs: number = PROBE_TIMEOUT_MS): Promise<boolean> {
    const probes = [probeIcmp(host, timeoutMs), ...PROBE_PORTS.map((port) => probeTcpPort(host, port, timeoutMs))]

    return anyResolvesTrue(probes)
}

/**
 * Resuelve el estado de un equipo:
 * - sin IP → 'desconocido' (se puede encender por MAC, pero no sondear).
 * - alcanzable → 'encendido'; en otro caso → 'apagado'.
 */
export async function resolveDeviceStatus(device: Device): Promise<DeviceStatus> {
    if (!device.ip) return 'desconocido'

    const reachable = await isReachable(device.ip)

    return reachable ? 'encendido' : 'apagado'
}

/** Resuelve `true` al primer sondeo exitoso; `false` solo si todos fallan. */
function anyResolvesTrue(probes: Promise<boolean>[]): Promise<boolean> {
    return new Promise((resolve) => {
        let remaining = probes.length

        if (remaining === 0) {
            resolve(false)
            return
        }

        const settle = (reachable: boolean) => {
            if (reachable) {
                resolve(true)
                return
            }

            remaining -= 1

            if (remaining === 0) {
                resolve(false)
            }
        }

        for (const probe of probes) {
            probe.then(settle, () => settle(false))
        }
    })
}
