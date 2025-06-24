export function formatDateToThai(input: string | Date): string {
  const date = new Date(input)
  const day = date.getDate()
  const month = date.toLocaleString('th-TH', { month: 'long' })
  const year = date.getFullYear() + 543
  return `${day} ${month} ${year}`
}
