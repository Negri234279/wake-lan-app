import { spawn } from 'node:child_process'

/**
 * Ejecuta un ping ICMP del sistema. Resuelve `true` si el host responde.
 * Los argumentos varían entre Windows y Unix (el runtime real es Linux/Docker).
 * Se usa `spawn` con array de argumentos (sin shell) para evitar inyección.
 */
export function probeIcmp(host: string, timeoutMs: number): Promise<boolean> {
    return new Promise((resolve) => {
        const child = spawn('ping', buildPingArgs(host, timeoutMs), {
            stdio: 'ignore',
        })

        child.once('error', () => resolve(false))
        child.once('close', (code) => resolve(code === 0))
    })
}

function buildPingArgs(host: string, timeoutMs: number): string[] {
    if (process.platform === 'win32') {
        return ['-n', '1', '-w', String(timeoutMs), host]
    }

    const seconds = Math.max(1, Math.ceil(timeoutMs / 1000))

    return ['-c', '1', '-W', String(seconds), host]
}
