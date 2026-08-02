interface Props {
    message: string
    onRetry: () => void
}

/** Aviso persistente cuando el backend no responde. */
export function ErrorBanner({ message, onRetry }: Props) {
    return (
        <div
            role="alert"
            class="border-danger/40 bg-danger/10 text-danger mt-6 flex items-center justify-between gap-4 rounded-lg border px-4 py-3 text-sm"
        >
            <span>⚠ {message}</span>
            <button onClick={onRetry} class="hover:text-text shrink-0 underline">
                Retry
            </button>
        </div>
    )
}
