import type { DeviceInput, FieldErrors } from '../types'
import { normalizeMac } from './mac'
import { isValidIpv4 } from './ip'

/** Valores ya saneados y listos para persistir. */
export interface CleanDeviceInput {
    name: string
    mac: string
    ip?: string
}

/** Resultado de validar la entrada: o bien valores limpios, o bien errores. */
export interface ValidationResult {
    values?: CleanDeviceInput
    errors?: FieldErrors
}

/**
 * Valida y normaliza la entrada de un equipo.
 * - `name`: obligatorio, no vacío.
 * - `mac`: obligatoria, normalizada a AA:BB:CC:DD:EE:FF.
 * - `ip`: opcional; si se aporta, debe ser IPv4 válida.
 */
export function validateDeviceInput(input: DeviceInput): ValidationResult {
    const errors: FieldErrors = {}

    const name = (input.name ?? '').trim()
    if (!name) {
        errors.name = 'Introduce un nombre.'
    }

    const mac = resolveMac(input.mac, errors)
    const ip = resolveIp(input.ip, errors)

    if (hasErrors(errors)) {
        return {
            errors,
        }
    }

    return {
        values: buildCleanInput(name, mac as string, ip),
    }
}

function resolveMac(rawMac: DeviceInput['mac'], errors: FieldErrors): string | null {
    const value = (rawMac ?? '').trim()
    if (!value) {
        errors.mac = 'Introduce la dirección MAC.'

        return null
    }

    const mac = normalizeMac(value)
    if (!mac) {
        errors.mac = 'MAC inválida. Usa el formato AA:BB:CC:DD:EE:FF.'
    }

    return mac
}

function resolveIp(rawIp: DeviceInput['ip'], errors: FieldErrors): string | undefined {
    const value = (rawIp ?? '').toString().trim()
    if (!value) return undefined

    if (!isValidIpv4(value)) {
        errors.ip = 'IP inválida. Usa el formato 192.168.1.10.'

        return undefined
    }

    return value
}

function hasErrors(errors: FieldErrors): boolean {
    return Object.keys(errors).length > 0
}

function buildCleanInput(name: string, mac: string, ip?: string): CleanDeviceInput {
    const clean: CleanDeviceInput = {
        name,
        mac,
    }

    if (ip) {
        clean.ip = ip
    }

    return clean
}
