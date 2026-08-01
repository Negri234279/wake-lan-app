import { useDisclosure } from '../hooks/useDisclosure'

interface Props {
    deviceName: string
    onEdit: () => void
    onDelete: () => void
}

/** Menú de acciones secundarias (editar / eliminar) de una card. */
export function OverflowMenu({ deviceName, onEdit, onDelete }: Props) {
    const menu = useDisclosure()

    const handleEdit = () => {
        menu.close()
        onEdit()
    }

    const handleDelete = () => {
        menu.close()
        onDelete()
    }

    return (
        <div class="relative">
            <button
                onClick={menu.toggle}
                aria-haspopup="menu"
                aria-expanded={menu.isOpen}
                aria-label={`Acciones para ${deviceName}`}
                class="text-text-muted hover:bg-surface-2 hover:text-text rounded-md px-1.5 transition"
            >
                ⋯
            </button>

            {menu.isOpen && (
                <>
                    <button
                        type="button"
                        tabIndex={-1}
                        aria-hidden="true"
                        onClick={menu.close}
                        class="fixed inset-0 z-10 cursor-default"
                    />
                    <div
                        role="menu"
                        class="border-border bg-surface-2 absolute right-0 z-20 mt-1 w-40 overflow-hidden rounded-lg border py-1 shadow-xl"
                    >
                        <button
                            role="menuitem"
                            onClick={handleEdit}
                            class="text-text hover:bg-surface flex w-full items-center gap-2 px-3 py-2 text-left text-sm"
                        >
                            ✎ Editar
                        </button>
                        <button
                            role="menuitem"
                            onClick={handleDelete}
                            class="text-danger hover:bg-surface flex w-full items-center gap-2 px-3 py-2 text-left text-sm"
                        >
                            🗑 Eliminar
                        </button>
                    </div>
                </>
            )}
        </div>
    )
}
