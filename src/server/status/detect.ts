import type { Device, DeviceStatus } from '../types'
import { PROBE_PORTS, PROBE_TIMEOUT_MS } from './config'
import { probeTcpPort } from './tcp'
import { probeIcmp } from './icmp'

/**
 * Determina si un host está alcanzable combinando sondeo TCP + ICMP.
 * Está "arriba" si responde cualquiera de los sondeos.
 */
export async function isReachable(host: string, timeoutMs: number = PROBE_TIMEOUT_MS): Promise<boolean> {
    const probes = [probeIcmp(host, timeoutMs), ...PROBE_PORTS.map((port) => probeTcpPort(host, port, timeoutMs))]
    const results = await Promise.all(probes.map(toSafeBoolean))

    return results.some((reachable) => reachable)
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

async function toSafeBoolean(probe: Promise<boolean>): Promise<boolean> {
    try {
        return await probe
    } catch {
        return false
    }
}
