import type { Device, DeviceInput, FieldErrors } from '../server/types'
import { ApiError } from '../lib/api'
import { useDeviceForm } from '../hooks/useDeviceForm'
import { useAsyncAction } from '../hooks/useAsyncAction'
import { Modal } from './Modal'
import { FormField } from './FormField'

interface Props {
    device?: Device
    onSubmit: (input: DeviceInput) => Promise<void>
    onClose: () => void
}

/** Modal de alta/edición de equipo (mismo formulario para ambos). */
export function DeviceFormModal({ device, onSubmit, onClose }: Props) {
    const form = useDeviceForm(device)
    const action = useAsyncAction()
    const title = device ? 'Edit device' : 'Add device'

    const handleSubmit = async (event: Event) => {
        event.preventDefault()

        const input = form.validate()
        if (!input) return

        const ok = await action.run(async () => {
            try {
                await onSubmit(input)
            } catch (error) {
                applyFieldErrors(error, form.setErrors)
                throw error
            }
        })

        if (ok) onClose()
    }

    return (
        <Modal title={title} onClose={onClose}>
            <div class="flex items-center justify-between">
                <h2 class="text-lg font-semibold">{title}</h2>
                <button onClick={onClose} aria-label="Close" class="text-text-muted hover:text-text text-lg">
                    ✕
                </button>
            </div>

            <form onSubmit={handleSubmit} class="mt-4 flex flex-col gap-4" noValidate>
                <FormField label="Name" htmlFor="device-name" required error={form.errors.name}>
                    <input
                        id="device-name"
                        value={form.values.name}
                        onInput={(event) => form.setField('name', event.currentTarget.value)}
                        class={inputClass(Boolean(form.errors.name))}
                    />
                </FormField>

                <FormField
                    label="MAC address"
                    htmlFor="device-mac"
                    required
                    hint="Format: AA:BB:CC:DD:EE:FF"
                    error={form.errors.mac}
                >
                    <input
                        id="device-mac"
                        value={form.values.mac}
                        onInput={(event) => form.setField('mac', event.currentTarget.value)}
                        class={`${inputClass(Boolean(form.errors.mac))} font-mono`}
                    />
                </FormField>

                <FormField
                    label="IP address (optional)"
                    htmlFor="device-ip"
                    hint="Used to check the device status."
                    error={form.errors.ip}
                >
                    <input
                        id="device-ip"
                        value={form.values.ip}
                        onInput={(event) => form.setField('ip', event.currentTarget.value)}
                        class={`${inputClass(Boolean(form.errors.ip))} font-mono`}
                    />
                </FormField>

                {action.error && (
                    <p class="text-danger text-sm" role="alert">
                        ⚠ Couldn't save the device.
                    </p>
                )}

                <div class="mt-2 flex justify-end gap-2">
                    <button
                        type="button"
                        onClick={onClose}
                        class="border-border text-text-muted hover:text-text rounded-lg border px-4 py-2 text-sm transition"
                    >
                        Cancel
                    </button>
                    <button
                        type="submit"
                        disabled={action.pending}
                        class="border-on/40 bg-on/10 text-on hover:bg-on/20 rounded-lg border px-4 py-2 text-sm font-medium transition disabled:opacity-60"
                    >
                        {action.pending ? '⟳ Saving…' : 'Save'}
                    </button>
                </div>
            </form>
        </Modal>
    )
}

function inputClass(hasError: boolean): string {
    const border = hasError ? 'border-danger' : 'border-border'

    return `bg-surface-2 text-text focus:border-boot w-full rounded-lg border px-3 py-2 text-sm outline-none ${border}`
}

function applyFieldErrors(error: unknown, setErrors: (fields: FieldErrors) => void) {
    if (error instanceof ApiError && error.fields) {
        setErrors(error.fields)
    }
}
