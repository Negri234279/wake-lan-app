interface Props {
    onAdd: () => void
}

/** Estado vacío: sin equipos todavía. */
export function EmptyState({ onAdd }: Props) {
    return (
        <section class="mt-16 flex flex-col items-center text-center">
            <div class="text-boot text-4xl drop-shadow-[0_0_12px_var(--color-boot)]">⚡</div>
            <h2 class="text-text mt-4 text-lg font-semibold">No devices yet</h2>
            <p class="text-text-muted mt-2 max-w-sm text-sm">
                Add your first device with its name and MAC address to wake it over the network.
            </p>
            <button
                onClick={onAdd}
                class="border-on/40 bg-on/10 text-on hover:bg-on/20 hover:shadow-glow-on mt-6 rounded-lg border px-4 py-2 text-sm font-medium transition"
            >
                + Add device
            </button>
        </section>
    )
}
