export function formatDateInput(raw: string) {
  if (!raw || raw.length !== 8) return ''
  return `${raw.slice(0, 4)}-${raw.slice(4, 6)}-${raw.slice(6, 8)}`
}
