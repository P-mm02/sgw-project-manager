import { LicenseType } from '@/models/License' // 👈 make sure this type exists
import License from '@/models/License'
import { formatDateToThai } from '@/lib/formatDateToThai'
import { sendLineMessage } from '@/lib/sendLineMessage'

export async function handleLicenseNotifications(licenses: LicenseType[]) {
  const today = new Date()
  const userId = 'Ua053de08814ccd75375a472e6a404f3e'
  const ninetyDaysFromNow = new Date(today.getTime() + 90 * 24 * 60 * 60 * 1000)
  const sixtyDaysFromNow = new Date(today.getTime() + 60 * 24 * 60 * 60 * 1000)
  const thirtyDaysFromNow = new Date(today.getTime() + 30 * 24 * 60 * 60 * 1000)

  await Promise.all(
    licenses.map(async (license) => {
      const rawExpireDate = license.licenseExpireDate
      if (!rawExpireDate) return

      const expireDate = new Date(rawExpireDate)
      if (
        (license.notificationSent === 0 && expireDate < ninetyDaysFromNow) ||
        (license.notificationSent === 1 && expireDate < sixtyDaysFromNow) ||
        (license.notificationSent === 2 && expireDate < thirtyDaysFromNow)
      ) {
        const message = `⚠️${license.clientName}\nใบอนุญาตเลขที่\n${
          license.licenseNumber
        }\nจะหมดอายุ วันที่\n${formatDateToThai(
          expireDate
        )}\n📌 เตรียมดำเนินการต่ออายุใบอนุญาต`

        await sendLineMessage(userId, message)
        await License.findByIdAndUpdate(license._id, {
          $inc: { notificationSent: 1 },
        })
      }
    })
  )
}
