export const BKK_TZ = 'Asia/Bangkok'

/** Return YYYY-MM-DD in Bangkok local time. */
export const toLocalDateString = (date: Date) =>
  date.toLocaleDateString('en-CA', { timeZone: BKK_TZ })

/** Build all Date objects for the visible month using local month/year. */
export function buildDaysInMonth(anchor: Date) {
  const year = anchor.getFullYear()
  const month = anchor.getMonth()
  const start = new Date(year, month, 1)
  const days: Date[] = []
  const d = new Date(start)
  while (d.getMonth() === month) {
    days.push(new Date(d))
    d.setDate(d.getDate() + 1)
  }
  return days
}

/** Local date math (no UTC drift) */
export function parseYMD(str: string): { y: number; m: number; d: number } {
  const [y, m, d] = str.split('-').map(Number)
  return { y, m, d }
}
export function makeLocalDate(ymd: string): Date {
  const { y, m, d } = parseYMD(ymd)
  return new Date(y, m - 1, d)
}
export function cmpYMD(a: string, b: string) {
  return a < b ? -1 : a > b ? 1 : 0
}
export function clampDateStr(dateStr: string, minStr: string, maxStr: string) {
  if (cmpYMD(dateStr, minStr) < 0) return minStr
  if (cmpYMD(dateStr, maxStr) > 0) return maxStr
  return dateStr
}
export function inclusiveSpanDays(a: string, b: string): number {
  const da = makeLocalDate(a)
  const db = makeLocalDate(b)
  const ms = db.getTime() - da.getTime()
  return Math.floor(ms / 86400000) + 1
}
export function dayIndexFromMonthStart(dayStr: string, monthStartStr: string) {
  return inclusiveSpanDays(monthStartStr, dayStr) - 1
}

/** Helpers for headers & today checks */
export const getDayInitial = (date: Date) =>
  ['S', 'M', 'T', 'W', 'T', 'F', 'S'][date.getDay()]

export const isToday = (date: Date) => {
  const today = toLocalDateString(new Date())
  return toLocalDateString(date) === today
}
