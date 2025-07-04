'use client'

import React, { useEffect, useState } from 'react'
import { EmployeeType } from '@/types/EmployeeType'
import DotsLoader from '@/loading/DotsLoader/DotsLoader' // ✅ make sure this path is correct

export default function EmployeeList() {
  const [employees, setEmployees] = useState<EmployeeType[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchEmployees = async () => {
      try {
        const res = await fetch('/api/employees')
        const data: EmployeeType[] = await res.json()
        setEmployees(data)
      } catch (error) {
        console.error('❌ Failed to fetch employees:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchEmployees()
  }, [])

  return (
    <>
      {loading ? (
        <DotsLoader />
      ) : (
        <div className="hr-card-list">
          {employees.map((emp) => (
            <div key={emp._id} className="hr-card">
              <strong>{emp.nickName || emp.firstName}</strong>
              <p>{emp.jobTitle}</p>
            </div>
          ))}
        </div>
      )}
    </>
  )
}
