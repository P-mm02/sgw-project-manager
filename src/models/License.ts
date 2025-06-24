import mongoose from 'mongoose'

const LicenseSchema = new mongoose.Schema({
    clientName: String,
    licenseNumber:String,
    wellNumber: String,
    clientAddress:String,
    wellDescription: String,
    licenseIssuedDate: Date,
    licenseExpireDate: Date,
    notificationSent: { type: Boolean, default: false },
    
}, { timestamps: true })

export default mongoose.models.License ||
  mongoose.model('License', LicenseSchema)
