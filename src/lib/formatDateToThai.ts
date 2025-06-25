export function formatDateToThai(input?: string | Date | null): string {
  if (!input) return 'ไม่ระบุ'

  const date = new Date(input)
  if (isNaN(date.getTime())) return 'ไม่ระบุ' // invalid date fallback

  const day = date.getDate()
  const month = date.toLocaleString('th-TH', { month: 'long' })
  const year = date.getFullYear() + 543
  return `${day} ${month} ${year}`
}
