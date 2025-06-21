import { convertNumberToMonth } from '@/lib/convertNumberToMonth'

export function formatStartEndDate(raw: string) {
  if (!raw || raw.length !== 8) return ''  
  if (raw[6]==='0') {
    return `${raw.slice(7, 8)} ${convertNumberToMonth(raw.slice(4, 6))} ${(parseInt(raw.slice(0, 4)) + 543).toString().slice(2, 4)}`
  }
  return `${raw.slice(6, 8)} ${convertNumberToMonth(raw.slice(4, 6))} ${(parseInt(raw.slice(0, 4)) + 543).toString().slice(2, 4)}`
}
