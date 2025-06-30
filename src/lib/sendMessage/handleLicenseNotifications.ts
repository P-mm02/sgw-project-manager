import { LicenseType } from '@/types/LicenseType'
import License from '@/models/License'
import { formatDateToThai } from '@/lib/date/formatDateToThai'
import { sendLineMessage } from '@/lib/sendMessage/sendLineMessage'
import mongoose from 'mongoose'

export async function handleLicenseNotifications(licenses: LicenseType[]) {
  const today = new Date()
  const userId = 'Ua053de08814ccd75375a472e6a404f3e'

  const ninetyDaysFromNow = new Date(today.getTime() + 90 * 86400000)
  const sixtyDaysFromNow = new Date(today.getTime() + 60 * 86400000)
  const thirtyDaysFromNow = new Date(today.getTime() + 30 * 86400000)

  await Promise.all(
    licenses.map(async (license) => {
      try {
        const rawExpireDate = license.licenseExpireDate
        if (!rawExpireDate) return

        const expireDate = new Date(rawExpireDate)

        const shouldNotify =
          (license.notificationSent === 0 && expireDate < ninetyDaysFromNow) ||
          (license.notificationSent === 1 && expireDate < sixtyDaysFromNow) ||
          (license.notificationSent === 2 && expireDate < thirtyDaysFromNow)

        if (!shouldNotify) return

        console.log(
          `📨 Preparing message for license: ${license.licenseNumber}`
        )

        const message = `⚠️${license.clientName}\nใบอนุญาตเลขที่\n${
          license.licenseNumber
        }\nจะหมดอายุ วันที่\n${formatDateToThai(
          expireDate
        )}\n📌 เตรียมดำเนินการต่ออายุใบอนุญาต`

        console.log(`📩 Sending LINE message...`)
        await sendLineMessage(userId, message)

        if (!license._id || !mongoose.isValidObjectId(license._id)) {
          console.warn(
            `⚠️ Skipping DB update: invalid license._id = ${license._id}`
          )
          return
        }

        console.log(`📝 Updating DB for license: ${license._id}`)
        await License.findByIdAndUpdate(license._id, {
          $inc: { notificationSent: 1 },
        })
      } catch (err) {
        console.error('❌ Error inside license notification loop:', err)
      }
    })
  )
  console.log('✅ handler completed successfully')

}
