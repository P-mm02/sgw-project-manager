'use client'

import { useEffect, useState } from 'react'
import { EmployeeType } from '@/types/EmployeeType'
import DotsLoader from '@/loading/DotsLoader/DotsLoader'
import './EmployeeList.css' // CSS in next step
import EmployeeModal from './EmployeeModal/EmployeeModal'
import { calculateAge, formatAddress } from '@/lib/employee/employeeFormat'
import { sortEmployees, SortableField } from '@/lib/employee/sortEmployees'
import Link from 'next/link'


export default function EmployeeList() {
  const [employees, setEmployees] = useState<EmployeeType[]>([])
  const [loading, setLoading] = useState(true)
  const [selected, setSelected] = useState<EmployeeType | null>(null)

  useEffect(() => {
    const fetchEmployees = async () => {
      const res = await fetch('/api/employees')
      const data: EmployeeType[] = await res.json()
      setEmployees(data)
      setLoading(false)
    }
    fetchEmployees()
  }, [])

  const [sortBy, setSortBy] = useState<SortableField>('jobTitle')
  
  // Sort before render:
  const sortedEmployees = sortEmployees(employees, sortBy)
    
  return (
    <div className="employee-container">
      <div className="employee-list-head">
        <h2>📋 รายชื่อพนักงาน</h2>
        <Link href="/HR/add" className="add-employee-btn">
          ➕ เพิ่มพนักงาน
        </Link>
      </div>
      <div className="employee-headers-wrap">
        <h1>เรียงลำดับ: </h1>
        <select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value as SortableField)}
        >
          <option value="jobTitle">ตำแหน่ง</option>
          <option value="team">หน่วย</option>
          <option value="nickName">ชื่อเล่น</option>
          <option value="firstName">ชื่อจริง</option>
          <option value="birthDate">อายุ</option>
        </select>
      </div>
      {loading ? (
        <DotsLoader />
      ) : (
        <table className="employee-table">
          <thead>
            <tr>
              <th className="DW760-display-none">ชื่อเล่น</th>
              <th>ชื่อเต็ม</th>
              <th>ตำแหน่ง</th>
              <th>หน่วย</th>
              <th className="DW1024-display-none">หน้าที่</th>
              <th className="DW1024-display-none">แผนก</th>
              <th className="DW760-display-none">เบอร์โทร</th>
              <th className="DW1440-display-none">ที่อยู่</th>
              <th className="DW1280-display-none">อายุงาน</th>
              <th className="DW760-display-none">อายุ</th>
              <th>เพิ่มเติม</th>
            </tr>
          </thead>
          <tbody>
            {sortedEmployees.map((emp) => {
              const age = calculateAge(emp.birthDate)
              const workAge = calculateAge(emp.startDate)
              const address = formatAddress(emp.currentAddress)
              return (
                <tr key={emp._id}>
                  <td className="DW760-display-none">{emp.nickName || '-'}</td>
                  <td>
                    {emp.firstName} {emp.lastName}
                  </td>
                  <td>{emp.jobTitle || '-'}</td>
                  <td>{emp.team?.name || '-'}</td>
                  <td className="DW1024-display-none">
                    {emp.team?.role || '-'}
                  </td>
                  <td className="DW1024-display-none">
                    {emp.department || '-'}
                  </td>
                  <td className="DW760-display-none">
                    {emp.phoneNumber || '-'}
                  </td>
                  <td className="DW1440-display-none">{address}</td>
                  <td className="DW1280-display-none text-center">{workAge}</td>
                  <td className="DW760-display-none text-center">{age}</td>
                  <td className="detail-cell">
                    <button
                      onClick={() => setSelected(emp)}
                      className="detail-btn"
                    >
                      เพิ่มเติม
                    </button>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      )}
      {/* Modal */}
      {selected && (
        <EmployeeModal employee={selected} onClose={() => setSelected(null)} />
      )}{' '}
    </div>
  )
}
