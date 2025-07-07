import mongoose, { Schema, model, models } from 'mongoose'

const NotificationSchema = new Schema(
  {
    title: {
      type: String,
      trim: true,
      default: 'ไม่มีหัวข้อ',
    },
    detail: {
      type: String,
      trim: true,
      default: '',
    },
    notifyBeforeDays: {
      type: Number,
      default: 0,
    },
    notifyMethod: {
      type: String,
      default: '',
    },
    notifyDate: {
      type: Date,
      default: () => new Date(), // now
    },
    createdBy: {
      type: String,
      default: 'system',
      trim: true,
    },
  },
  {
    timestamps: true, // adds createdAt and updatedAt
  }
)

const Notification =
  models.Notification || model('Notification', NotificationSchema)

export default Notification
