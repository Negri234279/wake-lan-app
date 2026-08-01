const MAC_SEPARATED = /^([0-9A-Fa-f]{2}[:-]){5}[0-9A-Fa-f]{2}$/
const MAC_BARE = /^[0-9A-Fa-f]{12}$/

/**
 * Normaliza una MAC a formato AA:BB:CC:DD:EE:FF (mayúsculas, separada por ':').
 * Acepta separadores ':' o '-' y también la forma sin separadores (12 hex).
 * Devuelve `null` si no es una MAC válida.
 */
export function normalizeMac(input: string): string | null {
    const value = input.trim()

    if (MAC_SEPARATED.test(value)) {
        return value.replace(/-/g, ':').toUpperCase()
    }

    if (MAC_BARE.test(value)) {
        return (value.toUpperCase().match(/.{2}/g) ?? []).join(':')
    }

    return null
}
