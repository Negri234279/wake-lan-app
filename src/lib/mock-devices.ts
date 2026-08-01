import type { DeviceStatus } from '../server/types'

/** Modelo de vista de un equipo en la UI (incluye estado y datos de arranque). */
export interface DeviceView {
    name: string
    ip: string | null
    mac: string
    status: DeviceStatus
    boot?: string
}

/**
 * MOCK temporal (solo visual) para revisar el estilado de las cards.
 * Se sustituye por datos reales del backend en la Fase 4.
 */
export const MOCK_DEVICES: DeviceView[] = [
    {
        name: 'Servidor-NAS',
        ip: '192.168.1.10',
        mac: 'AA:BB:CC:DD:EE:01',
        status: 'encendido',
    },
    {
        name: 'Torre-Gaming',
        ip: '192.168.1.24',
        mac: 'AA:BB:CC:DD:EE:02',
        status: 'apagado',
    },
    {
        name: 'Media-Center',
        ip: '192.168.1.31',
        mac: 'AA:BB:CC:DD:EE:03',
        status: 'comprobando',
    },
    {
        name: 'Render-Node',
        ip: '192.168.1.24',
        mac: 'AA:BB:CC:DD:EE:04',
        status: 'arrancando',
        boot: '0:14',
    },
    {
        name: 'Impresora-3D',
        ip: null,
        mac: 'AA:BB:CC:DD:EE:05',
        status: 'desconocido',
    },
]
