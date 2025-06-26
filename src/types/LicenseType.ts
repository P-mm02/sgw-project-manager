export type LicenseType = {
  _id?: string
  clientName?: string
  licenseNumber?: string
  licenseType?: 'drilling' | 'waterUse' | 'modify' | 'cancel'
  wellNumber?: string
  clientAddress?: string
  wellDescription?: string
  licenseIssuedDate?: string
  licenseExpireDate?: string
  notificationSent?: number
  createdAt?: string
  updatedAt?: string
  __v?: number
}
