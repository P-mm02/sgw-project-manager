export type LicenseType = {
  _id?: string
  clientName?: string
  licenseNumber?: string
  licenseType?: string
  wellNumber?: string
  clientAddress?: string
  wellDescription?: string
  depthStart?: string // ✅ depth: shallow
  depthEnd?: string // ✅ depth: deep
  wellWidth?: string // ✅ width in millimeters
  licenseIssuedDate?: string
  licenseExpireDate?: string
  notificationSent?: number
  createdAt?: string
  updatedAt?: string
  __v?: number
}
