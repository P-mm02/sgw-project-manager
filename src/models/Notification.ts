import mongoose, { Schema, model, models } from 'mongoose'

const NotificationSchema = new Schema(
  {
    title: {
      type: String,
      trim: true,
      default: 'ไม่มีหัวข้อ',
      set: (v: string) => v.replace(/\s+/g, ' ').trim(),
    },
    detail: {
      type: String,
      trim: true,
      default: '',
      set: (v: string) => v.replace(/\s+/g, ' ').trim(),
    },
    notifyBeforeDays: {
      type: [Number], // e.g., [90, 60, 30]
      default: [],
    },
    notifiedDays: {
      type: [Number], // e.g., [90, 60]
      default: [0,],
    },
    isNotified: {
      type: Boolean,
      default: false, // false = still waiting to notify all
    },
    notifyDate: {
      type: Date,
      default: () => new Date(),
    },
    createdBy: {
      type: String,
      trim: true,
      default: 'system',
      set: (v: string) => v.replace(/\s+/g, ' ').trim(),
    },
  },
  {
    timestamps: true,
  }
)

const Notification =
  models.Notification || model('Notification', NotificationSchema)
export default Notification
