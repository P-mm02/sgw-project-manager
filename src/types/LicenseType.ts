export type LicenseType = {
  _id?: string
  clientName?: string
  licenseNumber?: string
  licenseType?: 'drilling' | 'waterUse' | 'modify' | 'cancel'
  wellNumber?: string
  clientAddress?: string
  wellDescription?: string
  depthStart?: number // ✅ depth: shallow
  depthEnd?: number // ✅ depth: deep
  wellWidth?: number // ✅ width in millimeters
  licenseIssuedDate?: string
  licenseExpireDate?: string
  notificationSent?: number
  createdAt?: string
  updatedAt?: string
  __v?: number
}
