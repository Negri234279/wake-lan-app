import { useCallback, useState } from 'preact/hooks'

/** Estado abierto/cerrado reutilizable (menús, popovers). */
export function useDisclosure(initial = false) {
    const [isOpen, setIsOpen] = useState(initial)

    const open = useCallback(() => setIsOpen(true), [])
    const close = useCallback(() => setIsOpen(false), [])
    const toggle = useCallback(() => setIsOpen((value) => !value), [])

    return {
        isOpen,
        open,
        close,
        toggle,
    }
}
