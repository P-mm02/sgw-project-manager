import mongoose, { InferSchemaType, Schema } from 'mongoose'

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

export type LicenseType = InferSchemaType<typeof LicenseSchema> & {
  _id?: string
  createdAt?: Date
  updatedAt?: Date
  __v?: number
}

const License =
  mongoose.models.License || mongoose.model('License', LicenseSchema)
export default License
