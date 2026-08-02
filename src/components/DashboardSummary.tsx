interface Props {
    onCount: number
    offCount: number
    checking: boolean
}

/** Título de la sección + resumen de estado de la flota. */
export function DashboardSummary({ onCount, offCount, checking }: Props) {
    return (
        <div class="mt-8 flex items-end justify-between">
            <div>
                <h2 class="text-xl font-semibold">Devices</h2>
                <p class="text-text-muted mt-1 text-sm">{checking ? 'Checking status…' : 'Status up to date'}</p>
            </div>
            <p class="text-text-muted text-sm">
                <span class="text-on">{onCount} on</span> · <span class="text-off">{offCount} off</span>
            </p>
        </div>
    )
}
