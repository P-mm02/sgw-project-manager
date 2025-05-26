'use client'
import './ProjectCon.css'
import { useState } from 'react'
import MonthBtnCtrl from './MonthBtnCtrl/MonthBtnCtrl'
import MonthDP from './monthDP/monthDP'
import ProjectDP from './ProjectDP/ProjectDP'


export default function DPprojects() {
  const [monthCount, setMonthCount] = useState(12)
  

  return (
    <div className="projects-container">
      <MonthBtnCtrl monthCount={monthCount} setMonthCount={setMonthCount} />

      <div className="row-head">
        <div className="project-name">
          <h2>รายการ</h2>
        </div>
        <div className="project-location">
          <h2>สถานที่ตั้ง</h2>
        </div>
        <div className="row-month">
          <MonthDP monthCount={monthCount} />
        </div>
      </div>

      <ProjectDP monthCount={monthCount} />
    </div>
  )
}
