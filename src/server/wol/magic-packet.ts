import { normalizeMac } from '../validation/mac'

const SYNC_STREAM_BYTES = 6
const MAC_REPEAT = 16

/**
 * Construye el "magic packet" de Wake-on-LAN: 6 bytes 0xFF seguidos de la MAC
 * repetida 16 veces (102 bytes en total). Lanza si la MAC no es válida.
 */
export function buildMagicPacket(mac: string): Buffer {
    const normalized = normalizeMac(mac)
    if (!normalized) {
        throw new Error(`Invalid MAC: ${mac}`)
    }

    const sync = Buffer.alloc(SYNC_STREAM_BYTES, 0xff)
    const macBytes = toMacBytes(normalized)
    const repeated = Buffer.concat(Array.from({ length: MAC_REPEAT }, () => macBytes))

    return Buffer.concat([sync, repeated])
}

function toMacBytes(normalizedMac: string): Buffer {
    const octets = normalizedMac.split(':').map((part) => Number.parseInt(part, 16))

    return Buffer.from(octets)
}
