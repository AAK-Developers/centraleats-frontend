export const WAVE_PATH =
    'M0.00,49.98 C149.99,150.00 349.20,-49.98 500.00,49.98 L500.00,150.00 L0.00,150.00 Z'

export function WaveTop() {
    return (
        <div className="wave wave-top">
            <svg viewBox="0 0 500 150" preserveAspectRatio="none">
                <path d={WAVE_PATH} fill="#042E63" />
            </svg>
        </div>
    )
}

export function WaveBottom() {
    return (
        <div className="wave wave-bottom">
            <svg viewBox="0 0 500 150" preserveAspectRatio="none">
                <path d={WAVE_PATH} fill="#042E63" />
            </svg>
        </div>
    )
}
