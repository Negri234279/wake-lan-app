import type { DeviceStatus } from '../server/types'

/** Presentación de cada estado: etiqueta, glifo, color de texto y clases de glow. */
export interface StatusMeta {
    label: string
    glyph: string
    color: string
    glow: string
}

/**
 * Metadatos visuales por estado. El estado nunca se comunica solo por color:
 * siempre hay glifo + etiqueta, y el glow es refuerzo redundante.
 */
export const STATUS_META: Record<DeviceStatus, StatusMeta> = {
    encendido: {
        label: 'Encendido',
        glyph: '●',
        color: 'text-on',
        glow: 'shadow-glow-on border-transparent',
    },
    apagado: {
        label: 'Apagado',
        glyph: '○',
        color: 'text-off',
        glow: 'border-border',
    },
    comprobando: {
        label: 'Comprobando',
        glyph: '~',
        color: 'text-checking',
        glow: 'glow-checking border-transparent',
    },
    arrancando: {
        label: 'Arrancando',
        glyph: '⚡',
        color: 'text-boot',
        glow: 'shadow-glow-boot border-transparent',
    },
    desconocido: {
        label: 'Desconocido',
        glyph: '⊘',
        color: 'text-unknown',
        glow: 'border-border opacity-90',
    },
}
