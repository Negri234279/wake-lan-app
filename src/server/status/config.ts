/**
 * Puertos TCP habituales cuya respuesta (aceptando o rechazando) indica que el
 * equipo está encendido: RDP, SMB, SSH, HTTP y VNC.
 */
export const PROBE_PORTS = [3389, 445, 22, 80, 5900]

/** Timeout por sondeo individual (ms). */
export const PROBE_TIMEOUT_MS = 1200
