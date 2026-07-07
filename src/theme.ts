export interface Accent {
  solid: string
  tint: string
}

// Ciclo de acentos usado en badges de ranking, iconos y barras de progreso.
export const ACCENTS: Accent[] = [
  { solid: '#7c6ff0', tint: '#eeecfd' }, // violeta
  { solid: '#1fb88f', tint: '#e3f7f1' }, // esmeralda
  { solid: '#ff8b5e', tint: '#ffeee5' }, // coral
  { solid: '#4c9aff', tint: '#e8f1ff' }, // celeste
  { solid: '#f0ac2e', tint: '#fdf1de' }, // ámbar
]

export function accentFor(index: number): Accent {
  return ACCENTS[index % ACCENTS.length]
}

export function money(n: number): string {
  return `$${n.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
}
