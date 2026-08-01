const IPV4 = /^(\d{1,3})(\.\d{1,3}){3}$/

/** Validación blanda de IPv4 (opcional, no bloquea si está vacía). */
export function isValidIpv4(ip: string): boolean {
    if (!IPV4.test(ip)) return false

    return ip.split('.').every(isValidOctet)
}

function isValidOctet(octet: string): boolean {
    const value = Number(octet)

    return value >= 0 && value <= 255
}
