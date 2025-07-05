export type EmployeeType = {
    _id?: string
  
    firstName?: string
    lastName?: string
    nickName?: string
    jobTitle?: string
    department?: string
    email?: string
    phoneNumber?: string
    birthDate?: string // ISO date string e.g., "1990-01-01"
    startDate?: string // ISO date string
  
    currentAddress?: {
      houseNumber?: string
      street?: string
      subDistrict?: string
      district?: string
      province?: string
      postalCode?: string
    }
  
    idCardAddress?: {
      houseNumber?: string
      street?: string
      subDistrict?: string
      district?: string
      province?: string
      postalCode?: string
    }
  
    bankInfo?: {
      bankName?: string
      accountNumber?: string
    }
  
    team?: {
      name?: string
      role?: string
    }  
    
    isEmployed?: boolean
  
    createdAt?: string
    updatedAt?: string
    __v?: number
  }
  