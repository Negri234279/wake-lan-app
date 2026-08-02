import { useState } from 'preact/hooks'

import type { Device, DeviceInput, FieldErrors } from '../server/types'
import { normalizeMac } from '../server/validation/mac'
import { isValidIpv4 } from '../server/validation/ip'

export interface DeviceFormValues {
    name: string
    mac: string
    ip: string
}

type FormField = keyof DeviceFormValues

/**
 * Estado y validación del formulario de alta/edición. Reutiliza los validadores
 * puros del servidor (`normalizeMac`, `isValidIpv4`) para no duplicar reglas.
 */
export function useDeviceForm(initial?: Device) {
    const [values, setValues] = useState<DeviceFormValues>(toValues(initial))
    const [errors, setErrors] = useState<FieldErrors>({})

    const setField = (field: FormField, value: string) => {
        setValues((current) => ({
            ...current,
            [field]: value,
        }))
    }

    const validate = (): DeviceInput | null => {
        const nextErrors = collectErrors(values)
        setErrors(nextErrors)

        if (hasErrors(nextErrors)) return null

        return toInput(values)
    }

    return {
        values,
        errors,
        setField,
        setErrors,
        validate,
    }
}

function toValues(device?: Device): DeviceFormValues {
    return {
        name: device?.name ?? '',
        mac: device?.mac ?? '',
        ip: device?.ip ?? '',
    }
}

function collectErrors(values: DeviceFormValues): FieldErrors {
    const errors: FieldErrors = {}

    if (!values.name.trim()) {
        errors.name = 'Enter a name.'
    }

    if (!normalizeMac(values.mac)) {
        errors.mac = 'Invalid MAC. Use the format AA:BB:CC:DD:EE:FF.'
    }

    if (values.ip.trim() && !isValidIpv4(values.ip.trim())) {
        errors.ip = 'Invalid IP. Use the format 192.168.1.10.'
    }

    return errors
}

function toInput(values: DeviceFormValues): DeviceInput {
    return {
        name: values.name.trim(),
        mac: values.mac.trim(),
        ip: values.ip.trim() || null,
    }
}

function hasErrors(errors: FieldErrors): boolean {
    return Object.keys(errors).length > 0
}
