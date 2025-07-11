import { useState, useEffect, ReactNode } from 'react'

export default function CollapsePanel({
  title,
  children,
  defaultOpen = true,
}: {
  title: ReactNode
  children: ReactNode
  defaultOpen?: boolean
}) {
  const [open, setOpen] = useState(defaultOpen)

  // Sync open state with defaultOpen prop (for mobile/desktop toggle)
  useEffect(() => {
    setOpen(defaultOpen)
  }, [defaultOpen])

  return (
    <div className="collapse-panel">
      <button
        className="collapse-header"
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
      >
        <span>{title}</span>
        <span
          className="collapse-arrow"
          style={{
            transform: open ? 'rotate(90deg)' : 'rotate(0deg)',
          }}
        >
          ▶
        </span>
      </button>
      <div
        className="collapse-content"
        style={{
          maxHeight: open ? 2000 : 0,
          overflow: 'hidden',
          transition: 'max-height 0.3s ease',
          opacity: open ? 1 : 0,
          pointerEvents: open ? 'auto' : 'none', // optional, for accessibility
        }}
      >
        <div>{children}</div>
      </div>
    </div>
  )
}
