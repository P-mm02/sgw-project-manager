'use client'

import { EmployeeType } from '@/types/EmployeeType'

type Props = {
  employee: EmployeeType
  onClose: () => void
}

export default function EmployeeModal({ employee, onClose }: Props) {
  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <button onClick={onClose} className="close-btn">
          ❌
        </button>
        <h1>📋 ข้อมูลพนักงาน</h1>
        <p>
          <b>ชื่อ:</b> {employee.firstName} {employee.lastName}
        </p>
        <p>
          <b>ชื่อเล่น:</b> {employee.nickName}
        </p>
        <p>
          <b>ตำแหน่ง:</b> {employee.jobTitle}
        </p>
        <p>
          <b>แผนก:</b> {employee.department}
        </p>
        <p>
          <b>ทีม:</b> {employee.team?.name} ({employee.team?.role})
        </p>
        <p>
          <b>เบอร์โทร:</b> {employee.phoneNumber}
        </p>
        <p className="text-wrap">
          <b>อีเมล: </b> {employee.email}
        </p>
        <p>
          <b>วันเกิด:</b> {employee.birthDate?.slice(0, 10)}
        </p>
        <p>
          <b>เริ่มงาน:</b> {employee.startDate?.slice(0, 10)}
        </p>

        <h3>ที่อยู่ปัจจุบัน</h3>
        <p>
          {employee.currentAddress?.houseNumber}{' '}
          {employee.currentAddress?.street} ต.
          {employee.currentAddress?.subDistrict} อ.
          {employee.currentAddress?.district} จ.
          {employee.currentAddress?.province}{' '}
          {employee.currentAddress?.postalCode}
        </p>

        <h3>ที่อยู่บัตรประชาชน</h3>
        <p>
          {employee.idCardAddress?.houseNumber} {employee.idCardAddress?.street}{' '}
          ต.
          {employee.idCardAddress?.subDistrict} อ.
          {employee.idCardAddress?.district} จ.
          {employee.idCardAddress?.province}{' '}
          {employee.idCardAddress?.postalCode}
        </p>

        <h3>บัญชีธนาคาร</h3>
        <p>
          <b>ธนาคาร:</b> {employee.bankInfo?.bankName}
        </p>
        <p>
          <b>เลขบัญชี:</b> {employee.bankInfo?.accountNumber}
        </p>
      </div>
    </div>
  )
}
