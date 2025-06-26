// src/app/license/licenseCon.tsx
import { connectToDB } from '@/lib/mongoose'
import License from '@/models/License'
import { handleLicenseNotifications } from './handleLicenseNotifications'
import LicenseClient from './LicenseClient'
import { LicenseType } from '@/models/License'


export default async function LicenseCon() {
  // 1. Connect to MongoDB
  await connectToDB()

  // 2. Fetch all licenses, sorted by expiration date (latest to oldest)
  const licenses = (await License.find()
    .sort({ licenseExpireDate: -1 })
    .lean()) as LicenseType[]


  // 3. Run notification logic if licenses are near expiration
  await handleLicenseNotifications(licenses)

  // 4. Pass licenses as JSON-safe props to the client component
  return <LicenseClient licenses={licenses} />

}
