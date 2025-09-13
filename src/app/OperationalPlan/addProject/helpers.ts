// src/app/OperationalPlan/addProject/helpers.ts

export const BKK_TZ = 'Asia/Bangkok'

/** Return YYYY-MM-DD in Bangkok local time. */
export const toLocalDateString = (date: Date) =>
  date.toLocaleDateString('en-CA', { timeZone: BKK_TZ })

/** Validate string format YYYY-MM-DD */
export const isValidYMD = (s: string) => /^\d{4}-\d{2}-\d{2}$/.test(s)

/** Compare YYYY-MM-DD strings directly (avoids UTC shift issues) */
export const isDateOrderOK = (s: string, e: string) =>
  isValidYMD(s) && isValidYMD(e) && s <= e
