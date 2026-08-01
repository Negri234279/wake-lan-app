import type { ComponentChildren } from 'preact'

interface Props {
    label: string
    htmlFor: string
    required?: boolean
    hint?: string
    error?: string
    children: ComponentChildren
}

/** Campo de formulario: etiqueta, control, y ayuda o error asociados. */
export function FormField({ label, htmlFor, required, hint, error, children }: Props) {
    return (
        <div>
            <label for={htmlFor} class="text-text-muted mb-1 block text-sm">
                {label} {required && <span class="text-danger">*</span>}
            </label>

            {children}

            {hint && !error && <p class="text-text-muted/70 mt-1 text-xs">{hint}</p>}
            {error && (
                <p class="text-danger mt-1 text-xs" role="alert">
                    ⚠ {error}
                </p>
            )}
        </div>
    )
}
