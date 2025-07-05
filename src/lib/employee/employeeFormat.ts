export function calculateAge(dateString?: string) {
  return dateString
    ? Math.floor(
        (Date.now() - new Date(dateString).getTime()) /
          (365.25 * 24 * 60 * 60 * 1000)
      )
    : '-'
}

export function formatAddress(address?: any): string {
  return address
    ? [
        address.houseNumber,
        address.street,
        address.subDistrict,
        address.district,
        address.province,
        address.postalCode,
      ]
        .filter(Boolean)
        .join(' ')
    : '-'
}
