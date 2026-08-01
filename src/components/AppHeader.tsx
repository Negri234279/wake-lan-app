interface Props {
    onRefresh: () => void
    onAdd: () => void
    isRefreshing: boolean
}

/** Cabecera de la app: marca + acciones globales. */
export function AppHeader({ onRefresh, onAdd, isRefreshing }: Props) {
    return (
        <header class="flex items-center justify-between">
            <h1 class="flex items-center gap-2 text-lg font-semibold tracking-tight">
                <span class="text-on drop-shadow-[0_0_8px_var(--color-on)]">◉</span>
                WakeLAN
            </h1>
            <div class="flex items-center gap-2">
                <button
                    onClick={onRefresh}
                    disabled={isRefreshing}
                    class="border-border bg-surface text-text-muted hover:text-text hover:border-text-muted rounded-lg border px-3 py-2 text-sm transition disabled:opacity-60"
                >
                    {isRefreshing ? '⟳ Actualizando…' : '⟳ Refrescar'}
                </button>
                <button
                    onClick={onAdd}
                    class="border-on/40 bg-on/10 text-on hover:bg-on/20 hover:shadow-glow-on rounded-lg border px-3 py-2 text-sm font-medium transition"
                >
                    + Añadir equipo
                </button>
            </div>
        </header>
    )
}
