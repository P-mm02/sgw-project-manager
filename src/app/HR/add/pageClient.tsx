'use client'

import dynamic from 'next/dynamic'
import './AddEmployeeForm/AddEmployeeForm.css'

const AddEmployeeForm = dynamic(() => import('./AddEmployeeForm/AddEmployeeForm'), {
  ssr: false,
  loading: () => <p>Loading form...</p>,
})

export default function AddEmployeePageClient() {
  return (
    <main className="hr-add-container">
      <h1 className="hr-add-title">➕ เพิ่มพนักงานใหม่</h1>
      <AddEmployeeForm />
    </main>
  )
}
