import type { ComponentChildren } from 'preact'
import { useEffect, useRef } from 'preact/hooks'

interface Props {
    title: string
    onClose: () => void
    children: ComponentChildren
}

/** Modal base: rol de diálogo, cierre con Esc y clic en el fondo, foco gestionado. */
export function Modal({ title, onClose, children }: Props) {
    const dialogRef = useRef<HTMLDivElement>(null)

    useEffect(() => {
        const previouslyFocused = document.activeElement as HTMLElement | null
        dialogRef.current?.focus()

        const onKeyDown = (event: KeyboardEvent) => {
            if (event.key === 'Escape') onClose()
        }

        document.addEventListener('keydown', onKeyDown)

        return () => {
            document.removeEventListener('keydown', onKeyDown)
            previouslyFocused?.focus()
        }
    }, [onClose])

    return (
        <div class="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4" onClick={onClose}>
            <div
                ref={dialogRef}
                role="dialog"
                aria-modal="true"
                aria-label={title}
                tabIndex={-1}
                onClick={(event) => event.stopPropagation()}
                class="border-border bg-surface w-full max-w-md rounded-[var(--radius-card)] border p-6 shadow-2xl outline-none"
            >
                {children}
            </div>
        </div>
    )
}
