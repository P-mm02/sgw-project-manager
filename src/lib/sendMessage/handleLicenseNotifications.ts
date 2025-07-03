import { LicenseType } from '@/types/LicenseType'
import License from '@/models/License'
import { formatDateToThai } from '@/lib/date/formatDateToThai'
import { sendLineMessage } from '@/lib/sendMessage/sendLineMessage'

export async function handleLicenseNotifications(licenses: LicenseType[]) {
  const today = new Date()
//SGW weeID
  const userIds = ['C0fc7a3d81a3b48dac518739672356f1d']
  //SGW GroupID SG แจ้งเตือน
  /*   const userIds = [
    'C0fc7a3d81a3b48dac518739672356f1d',  
  ]
 */
  //SGW userIds
  /*   const userIds = [
    'C0fc7a3d81a3b48dac518739672356f1d',
    'U7954973400f148caf34e524adc4db5ac',
    'U45649660c3ff9de01615478639509a76',
    'U8bb70a35218c0ac670343d5449a60ab6',
  ] */
  //SGW-TEST userIds
  /*   const userIds = [
    'Ua053de08814ccd75375a472e6a404f3e',
    'U4a74a0e50ecbc9807f53b020a56a7951',
  ] */

  const ninetyDaysFromNow = new Date(today.getTime() + 90 * 86400000)
  const sixtyDaysFromNow = new Date(today.getTime() + 60 * 86400000)
  const thirtyDaysFromNow = new Date(today.getTime() + 30 * 86400000)

  for (const license of licenses) {
    const rawExpireDate = license.licenseExpireDate
    if (!rawExpireDate) continue

    const expireDate = new Date(rawExpireDate)

    const shouldNotify =
      (license.notificationSent === 0 && expireDate < ninetyDaysFromNow) ||
      (license.notificationSent === 1 && expireDate < sixtyDaysFromNow) ||
      (license.notificationSent === 2 && expireDate < thirtyDaysFromNow)

    if (!shouldNotify) continue

    const message = `ทดสอบข้อความอัตโนมัติ แจ้งเตือนใบอนุญาติใกล้หมดอายุ
    ⚠️ ${license.clientName}\n
    ใบอนุญาตเลขที่\n
    ${license.licenseNumber}\n
    จะหมดอายุ วันที่\n
    ${formatDateToThai(expireDate)}\n
    📌 เตรียมดำเนินการต่ออายุใบอนุญาต`

    try {
      for (const userId of userIds) {
        await sendLineMessage(userId, message)
      }

      if (license._id) {
        await License.findByIdAndUpdate(license._id, {
          $inc: { notificationSent: 1 },
        })
      }
    } catch (err) {
      console.error('Error notifying for license:', license._id, err)
    }
  }
}
