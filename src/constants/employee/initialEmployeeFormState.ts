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
