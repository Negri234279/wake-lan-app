import { createSocket } from 'node:dgram'

import { buildMagicPacket } from './magic-packet'

/** Opciones de envío del magic packet. */
export interface WakeOptions {
    address?: string
    port?: number
}

const DEFAULT_ADDRESS = '255.255.255.255'
const DEFAULT_PORT = 9

/**
 * Envía un magic packet de Wake-on-LAN por UDP broadcast.
 * Por defecto difunde a 255.255.255.255:9.
 */
export function wake(mac: string, options: WakeOptions = {}): Promise<void> {
    const address = options.address ?? DEFAULT_ADDRESS
    const port = options.port ?? DEFAULT_PORT
    const packet = buildMagicPacket(mac)

    return new Promise((resolve, reject) => {
        const socket = createSocket('udp4')

        socket.once('error', (error) => {
            socket.close()
            reject(error)
        })

        socket.bind(() => {
            socket.setBroadcast(true)
            socket.send(packet, port, address, (error) => {
                socket.close()

                if (error) {
                    reject(error)
                    return
                }

                resolve()
            })
        })
    })
}
