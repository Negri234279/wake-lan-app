import { Socket } from 'node:net'

/**
 * Comprueba un puerto TCP. Se considera "alcanzable" tanto si la conexión se
 * establece como si el host la rechaza (RST/ECONNREFUSED): en ambos casos el
 * equipo está encendido. Solo el timeout o un error de red cuentan como caído.
 */
export function probeTcpPort(host: string, port: number, timeoutMs: number): Promise<boolean> {
    return new Promise((resolve) => {
        const socket = new Socket()
        let settled = false

        const finish = (reachable: boolean) => {
            if (settled) return

            settled = true
            socket.destroy()
            resolve(reachable)
        }

        socket.setTimeout(timeoutMs)
        socket.once('connect', () => finish(true))
        socket.once('timeout', () => finish(false))
        socket.once('error', (error) => finish(isRefused(error)))
        socket.connect(port, host)
    })
}

function isRefused(error: NodeJS.ErrnoException): boolean {
    return error.code === 'ECONNREFUSED'
}
