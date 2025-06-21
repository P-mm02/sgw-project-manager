export function formatDateOutput(formatted: string) {
  if (!formatted || formatted.length !== 10) return ''
  return formatted.replace(/-/g, '')
}
