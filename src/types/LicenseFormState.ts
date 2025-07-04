import type { LicenseType } from './LicenseType'
import type { FormFriendly } from './utils'

// Use all fields from LicenseType, but convert array/date fields to strings for forms
// Then omit fields that shouldn't appear in the form
export type LicenseFormState = Omit<
  FormFriendly<LicenseType>,
  '_id' | 'createdAt' | 'updatedAt' | '__v' | 'notificationSent'
>
