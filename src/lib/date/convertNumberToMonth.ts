const thaiMonthsShort = [
  'ม.ค.',
  'ก.พ.',
  'มี.ค.',
  'เม.ย.',
  'พ.ค.',
  'มิ.ย.',
  'ก.ค.',
  'ส.ค.',
  'ก.ย.',
  'ต.ค.',
  'พ.ย.',
  'ธ.ค.',
]

export function convertNumberToMonth(month: number | string): string {
  const monthIndex =
    typeof month === 'string' ? parseInt(month, 10) - 1 : month - 1

  if (monthIndex < 0 || monthIndex > 11) return ''

  return thaiMonthsShort[monthIndex]
}
