// src/constants/employee/initialEmployeeFormState.ts
import type { EmployeeFormState } from '@/types/EmployeeFormState'

export const initialEmployeeFormState: EmployeeFormState = {
  firstName: '',
  lastName: '',
  nickName: '',
  jobTitle: '',
  department: '',
  email: '',
  phoneNumber: '',
  birthDate: '',
  startDate: '',

  // 👇 Added fields
  weight: 0,
  height: 0,

  currentAddress: {
    houseNumber: '',
    street: '',
    subDistrict: '',
    district: '',
    province: '',
    postalCode: '',
  },

  idCardAddress: {
    houseNumber: '',
    street: '',
    subDistrict: '',
    district: '',
    province: '',
    postalCode: '',
  },

  bankInfo: {
    bankName: '',
    accountNumber: '',
  },

  team: {
    name: '',
    role: '',
  },
}
