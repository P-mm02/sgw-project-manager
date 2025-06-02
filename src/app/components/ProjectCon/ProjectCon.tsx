'use client'
import './ProjectCon.css'
import { useState } from 'react'
import MonthBtnCtrl from './MonthBtnCtrl/MonthBtnCtrl'
import MonthDP from './monthDP/monthDP'
import ProjectDP from './ProjectDP/ProjectDP'
import MonthSelectBtn from './MonthSelectBtn/MonthSelectBtn'


export default function DPprojects() {
  const [monthCount, setMonthCount] = useState(1)
  const [monthSelect, setMonthSelect] = useState<number>(() => 0);
  

  return (
    <div className="projects-container">
      <MonthBtnCtrl monthCount={monthCount} setMonthCount={setMonthCount} />
      <MonthSelectBtn
        monthSelect={monthSelect}
        setMonthSelect={setMonthSelect}
      />

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

      <ProjectDP monthCount={monthCount} monthSelect={monthSelect} />
    </div>
  )
}
