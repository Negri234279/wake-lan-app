/** Modelo de un equipo persistido en el JSON. */
export interface Device {
    id: string
    /** Nombre mostrado en la card. */
    name: string
    /** Dirección MAC normalizada (AA:BB:CC:DD:EE:FF). Requerida por Wake-on-LAN. */
    mac: string
    /** IP opcional, solo usada para el sondeo de estado. */
    ip?: string
}

/** Datos de entrada al crear/editar un equipo (sin id). */
export interface DeviceInput {
    name: string
    mac: string
    ip?: string | null
}

/** Estado de un equipo, resuelto por el sondeo de red (Fase 2). */
export type DeviceStatus = 'encendido' | 'apagado' | 'comprobando' | 'arrancando' | 'desconocido'

/** Estado de un equipo devuelto por los endpoints de sondeo. */
export interface DeviceStatusEntry {
    id: string
    status: DeviceStatus
}

/** Campos de un equipo sobre los que puede haber error de validación. */
export type DeviceField = 'name' | 'mac' | 'ip'

/** Errores de validación indexados por campo. */
export type FieldErrors = Partial<Record<DeviceField, string>>
