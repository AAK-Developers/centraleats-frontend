import type { ReactNode } from 'react'
import type { Accent } from '../theme'

export function IconTile({ accent, size = 34, children }: { accent: Accent; size?: number; children: ReactNode }) {
  return (
    <div
      className="icon-tile"
      style={{ width: size, height: size, background: accent.tint, color: accent.solid }}
    >
      {children}
    </div>
  )
}

export function GroupLabel({ accent, children }: { accent: Accent; children: ReactNode }) {
  return (
    <div className="group-label">
      <div className="bar" style={{ background: accent.solid }} />
      <span>{children}</span>
    </div>
  )
}

export function BlockHeader({ title, subtitle }: { title: string; subtitle?: string }) {
  return (
    <div className="block-header">
      <h2>{title}</h2>
      {subtitle && <div className="block-subtitle">{subtitle}</div>}
    </div>
  )
}
