import { Schema, model, models } from 'mongoose'

const EmployeeSchema = new Schema(
  {
    firstName: { type: String, default: '-' },
    lastName: { type: String, default: '-' },
    nickName: { type: String, default: '-' },
    jobTitle: { type: String, default: '-' },
    department: { type: String, default: '-' },
    email: { type: String, default: '-' },
    phoneNumber: { type: String, default: '-' },
    birthDate: Date,
    startDate: Date,

    currentAddress: {
      houseNumber: { type: String, default: '-' },
      street: { type: String, default: '-' },
      subDistrict: { type: String, default: '-' },
      district: { type: String, default: '-' },
      province: { type: String, default: '-' },
      postalCode: { type: String, default: '-' },
    },

    idCardAddress: {
      houseNumber: { type: String, default: '-' },
      street: { type: String, default: '-' },
      subDistrict: { type: String, default: '-' },
      district: { type: String, default: '-' },
      province: { type: String, default: '-' },
      postalCode: { type: String, default: '-' },
    },

    bankInfo: {
      bankName: { type: String, default: '-' },
      accountNumber: { type: String, default: '-' },
    },

    team: {
      name: { type: String, default: '-' },
      role: { type: String, default: '-' },
    },

    kpiScores: [
      {
        score: Number,
        comment: { type: String, default: '-' },
        dateEvaluated: Date,
      },
    ],

    kpiGiven: [
      {
        targetEmployeeId: { type: Schema.Types.ObjectId, ref: 'Employee' },
        dateGiven: { type: Date, default: Date.now },
      },
    ],

    isEmployed: { type: Boolean, default: true },
  },
  { timestamps: true }
)

const Employee = models.Employee || model('Employee', EmployeeSchema)
export default Employee
