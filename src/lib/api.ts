import type { Device, DeviceInput, DeviceStatusEntry, FieldErrors } from '../server/types'

/** Error de la API con el código HTTP y, si aplica, errores por campo. */
export class ApiError extends Error {
    readonly status: number
    readonly fields?: FieldErrors

    constructor(message: string, status: number, fields?: FieldErrors) {
        super(message)
        this.name = 'ApiError'
        this.status = status
        this.fields = fields
    }
}

interface ApiErrorBody {
    error?: string
    fields?: FieldErrors
}

async function request<T>(url: string, init: RequestInit = {}): Promise<T> {
    const response = await fetch(url, {
        headers: {
            'content-type': 'application/json',
        },
        ...init,
    })

    if (!response.ok) {
        throw await toApiError(response)
    }

    if (response.status === 204) {
        return undefined as T
    }

    return (await response.json()) as T
}

async function toApiError(response: Response): Promise<ApiError> {
    const body = await safeJson(response)

    return new ApiError(body?.error ?? 'Error de red', response.status, body?.fields)
}

async function safeJson(response: Response): Promise<ApiErrorBody | null> {
    try {
        return (await response.json()) as ApiErrorBody
    } catch {
        return null
    }
}

export function fetchDevices(): Promise<Device[]> {
    return request<Device[]>('/api/devices')
}

export function createDevice(input: DeviceInput): Promise<Device> {
    return request<Device>('/api/devices', {
        method: 'POST',
        body: JSON.stringify(input),
    })
}

export function updateDevice(id: string, input: DeviceInput): Promise<Device> {
    return request<Device>(`/api/devices/${id}`, {
        method: 'PATCH',
        body: JSON.stringify(input),
    })
}

export function deleteDevice(id: string): Promise<void> {
    return request<void>(`/api/devices/${id}`, {
        method: 'DELETE',
    })
}

export function wakeDevice(id: string): Promise<void> {
    return request<void>(`/api/devices/${id}/wake`, {
        method: 'POST',
    })
}

export function fetchFleetStatus(): Promise<DeviceStatusEntry[]> {
    return request<DeviceStatusEntry[]>('/api/status')
}
