export function getDateDiff(expireDate: Date | string): number {
  const today = new Date()
  const expiry = new Date(expireDate)
  const diffTime = expiry.getTime() - today.getTime()
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
  return diffDays
}
