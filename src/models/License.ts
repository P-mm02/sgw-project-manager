import mongoose, { Schema } from 'mongoose'

const LicenseSchema = new Schema(
  {
    clientName: String,
    licenseNumber: String,
    licenseType: String,
    wellNumber: String,
    clientAddress: String,
    wellDescription: String,
    licenseIssuedDate: Date,
    licenseExpireDate: Date,
    notificationSent: { type: Number, default: 0 },
  },
  {
    timestamps: true,
    collection: 'licenses',
  }
)

const License =
  mongoose.models.License || mongoose.model('License', LicenseSchema)

export default License
