// src/components/DateInputTH.tsx
'use client'

import { useMemo } from 'react'

type Props = {
  /** Controlled value in 'YYYY-MM-DD' (Gregorian) */
  value?: string
  onChange: (value: string) => void

  /** Limits, also in 'YYYY-MM-DD' (Gregorian) */
  min?: string
  max?: string

  /** Visual options */
  locale?: 'th' | 'en' // month labels
  buddhistEra?: boolean // show years as BE (พ.ศ.) while storing CE
  className?: string // applied to each <select>
  disabled?: boolean
  placeholders?: { year?: string; month?: string; day?: string }
}

const pad2 = (n: number) => String(n).padStart(2, '0')
const parse = (v?: string) => {
  if (!v) return { y: 0, m: 0, d: 0 }
  const [yy, mm, dd] = v.split('-').map(Number)
  return { y: yy || 0, m: mm || 0, d: dd || 0 }
}
const toYMD = (y: number, m: number, d: number) =>
  `${String(y)}-${pad2(m)}-${pad2(d)}`

const daysInMonth = (y: number, m: number) => new Date(y, m, 0).getDate()
const cmpYMD = (
  a: { y: number; m: number; d: number },
  b: { y: number; m: number; d: number }
) => {
  if (a.y !== b.y) return a.y - b.y
  if (a.m !== b.m) return a.m - b.m
  return a.d - b.d
}
const clampToRange = (
  y: number,
  m: number,
  d: number,
  min?: string,
  max?: string
) => {
  if (min) {
    const c = cmpYMD({ y, m, d }, parse(min))
    if (c < 0) return parse(min)
  }
  if (max) {
    const c = cmpYMD({ y, m, d }, parse(max))
    if (c > 0) return parse(max)
  }
  return { y, m, d }
}

const TH_MONTHS = [
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
const EN_MONTHS = [
  'Jan',
  'Feb',
  'Mar',
  'Apr',
  'May',
  'Jun',
  'Jul',
  'Aug',
  'Sep',
  'Oct',
  'Nov',
  'Dec',
]

export default function DateInputTH({
  value,
  onChange,
  min,
  max,
  locale = 'th',
  buddhistEra = true,
  className = 'op-input',
  disabled,
  placeholders = { year: 'ปี', month: 'เดือน', day: 'วัน' },
}: Props) {
  const { y: vy, m: vm, d: vd } = parse(value)
  const months = locale === 'th' ? TH_MONTHS : EN_MONTHS

  // Year range derives from min/max if present; else sensible defaults
  const { yearsAsc, yMin, yMax } = useMemo(() => {
    const nowY = new Date().getFullYear()
    const minY = min ? parse(min).y : nowY - 5
    const maxY = max ? parse(max).y : nowY + 5
    const list: number[] = []
    for (let y = minY; y <= maxY; y++) list.push(y)
    return { yearsAsc: list, yMin: minY, yMax: maxY }
  }, [min, max])

  const selY = vy || (min ? parse(min).y : yMax)
  const selM = vm || 1
  const maxDay = daysInMonth(selY, selM)
  const selD = vd ? Math.min(vd, maxDay) : 1

  // Build options respecting min/max
  const validMonths = useMemo(() => {
    const months: number[] = []
    for (let m = 1; m <= 12; m++) {
      const first = clampToRange(selY, m, 1, min, max)
      const last = clampToRange(selY, m, daysInMonth(selY, m), min, max)
      // month is valid if the clamp stays within this year-month at least partially
      const monthTouches =
        (first.y === selY && first.m === m) || (last.y === selY && last.m === m)
      if (monthTouches) months.push(m)
    }
    return months
  }, [selY, min, max])

  const validDays = useMemo(() => {
    const days: number[] = []
    const dMax = daysInMonth(selY, selM)
    for (let d = 1; d <= dMax; d++) {
      const c = clampToRange(selY, selM, d, min, max)
      if (c.y === selY && c.m === selM && c.d === d) days.push(d)
    }
    return days
  }, [selY, selM, min, max])

  const emit = (y: number, m: number, d: number) => {
    // Clamp to range and month length before emitting
    const cappedD = Math.min(d, daysInMonth(y, m))
    const clamped = clampToRange(y, m, cappedD, min, max)
    onChange(toYMD(clamped.y, clamped.m, clamped.d))
  }

  const onYearChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const y = Number(e.target.value) || 0
    if (!y) return
    // if month currently invalid under new year, pick closest valid month
    const m = validMonths.includes(selM) ? selM : validMonths[0]
    const d = validDays.includes(selD) ? selD : 1
    emit(y, m, d)
  }

  const onMonthChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const m = Number(e.target.value) || 0
    if (!m) return
    const d = Math.min(selD, daysInMonth(selY, m))
    emit(selY, m, d)
  }

  const onDayChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const d = Number(e.target.value) || 0
    if (!d) return
    emit(selY, selM, d)
  }

  return (
    <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
      {/* Day */}
      <select
        aria-label="Day"
        className={className}
        value={validDays.includes(selD) ? selD : ''}
        onChange={onDayChange}
        disabled={disabled || !selY || !validMonths.includes(selM)}
      >
        <option value="">{placeholders.day ?? 'Day'}</option>
        {validDays.map((D) => (
          <option key={D} value={D}>
            {D}
          </option>
        ))}
      </select>

      {/* Month */}
      <select
        aria-label="Month"
        className={className}
        value={validMonths.includes(selM) ? selM : ''}
        onChange={onMonthChange}
        disabled={disabled || !selY}
      >
        <option value="">{placeholders.month ?? 'Month'}</option>
        {validMonths.map((M) => (
          <option key={M} value={M}>
            {months[M - 1]}
          </option>
        ))}
      </select>

      {/* Year */}
      <select
        aria-label="Year"
        className={className}
        value={selY || ''}
        onChange={onYearChange}
        disabled={disabled}
      >
        <option value="" >
          {placeholders.year ?? 'Year'}
        </option>
        {yearsAsc.map((Y) => (
          <option key={Y} value={Y}>
            {buddhistEra ? Y + 543 : Y}
          </option>
        ))}
      </select>
    </div>
  )
}
