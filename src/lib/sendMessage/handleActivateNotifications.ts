import type { NotificationType } from '@/types/NotificationType'
import Notification from '@/models/Notification'
import { sendLineMessage } from '@/lib/sendMessage/sendLineMessage'

const userIds = ['C0fc7a3d81a3b48dac518739672356f1d']
  //SGW weeID
  //const userIds = ['U7954973400f148caf34e524adc4db5ac']

  //SGW GroupID SG แจ้งเตือน
  //const userIds = ['C0fc7a3d81a3b48dac518739672356f1d']
  
function daysDiff(date1: Date, date2: Date): number {
  return Math.floor(
    (date1.setHours(0, 0, 0, 0) - date2.setHours(0, 0, 0, 0)) / 86400000
  )
}

function buildNotificationMessage(
  notify: NotificationType,
  notifyBeforeDay: number
): string {
  return (
    `🔔 ระบบแจ้งเตือนอัตโนมัติ` +
    (notifyBeforeDay !== 0
      ? `\nแจ้งเตือน ${notifyBeforeDay} วันล่วงหน้า`
      : '') +
    `\nเรื่อง: ${notify.title || 'ไม่ระบุ'}` +
    `\n${notify.detail ? `รายละเอียด: ${notify.detail}\n` : 'ไม่ระบุ'}` +
    `\nวันนัดหมาย: ${
      notify.notifyDate
        ? new Date(notify.notifyDate).toLocaleString('th-TH', {
            dateStyle: 'medium',
          })
        : '-'
    }`
  )
}

async function sendAndMarkNotification(
  notify: NotificationType,
  notifyBeforeDay: number,
  userIds: string[]
) {
  const message = buildNotificationMessage(notify, notifyBeforeDay)

  try {
    for (const userId of userIds) {
      await sendLineMessage(userId, message)
    }

    if (notify._id && notifyBeforeDay>0) {
      await Notification.findByIdAndUpdate(notify._id, {
        $addToSet: { notifiedDays: notifyBeforeDay },
      })
      console.log(
        `Notification ${notify._id} sent for ${notifyBeforeDay} notifyBeforeDay and updated notifiedDays`
      )
    }
  } catch (err) {
    console.error('Error notifying for notification:', notify._id, err)
  }
}

export async function handleActivateNotifications(
  notifications: NotificationType[]
) {
  console.log('handleActivateNotifications: START')
  const today = new Date()

  for (const notify of notifications) {
    if (!notify.notifyDate) continue
    const notifyDate = new Date(notify.notifyDate)
    const notifyBeforeDays = notify.notifyBeforeDays || []
    const notifiedDays = notify.notifiedDays || []
    

    if (daysDiff(notifyDate, today) === 0) {
      await sendAndMarkNotification(notify, 0, userIds)
      await Notification.findByIdAndUpdate(notify._id, { isNotified: true })
      console.log(`Notification ${notify._id} marked as isNotified`)
      continue
    }


    for (const notifyBeforeDay of notifyBeforeDays) {
      if (notifiedDays.includes(notifyBeforeDay)) continue
      const targetDate = new Date(notifyDate)
      targetDate.setDate(targetDate.getDate() - notifyBeforeDay)

      if (daysDiff(today, targetDate) === 0) {
        await sendAndMarkNotification(notify, notifyBeforeDay, userIds)
      }
    }
  }
  console.log('handleActivateNotifications: END')
}
