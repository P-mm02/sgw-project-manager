export function toInt(v: string, def = 0) {
  const n = parseInt(v, 10)
  return Number.isFinite(n) ? n : def
}

export function normalizeHexColor(v: string): string {
  if (!v) return '#e2e8f0'
  let s = v.trim().toLowerCase()
  if (s.startsWith('0x')) s = s.slice(2)
  if (!s.startsWith('#')) s = `#${s}`
  if (/^#[0-9a-f]{3}$/i.test(s)) {
    const h = s.slice(1)
    s =
      '#' +
      h
        .split('')
        .map((c) => c + c)
        .join('')
  }
  if (!/^#[0-9a-f]{6}$/i.test(s)) return '#e2e8f0'
  return s
}
