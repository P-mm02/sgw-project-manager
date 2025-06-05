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
  const [yearSelect, setYearSelect] = useState<number>(() => 2025)

  return (
    <div className="projects-container">
      <MonthBtnCtrl monthCount={monthCount} setMonthCount={setMonthCount} setMonthSelect={setMonthSelect}/>
      <MonthSelectBtn
        monthSelect={monthSelect}
        setMonthSelect={setMonthSelect}
        yearSelect={yearSelect}
        setYearSelect={setYearSelect}
        monthCount={monthCount}
      />

      <div className="row-head">
        <div className="project-names">
          <h2>รายการ</h2>
        </div>
        <div className="project-locations">
          <h2>สถานที่ตั้ง</h2>
        </div>
        <div className="project-working-days">
          <h2>จำนวนวัน</h2>
        </div>
        <div className="row-month">
          <MonthDP monthCount={monthCount} monthSelect={monthSelect} />
        </div>
      </div>

      <ProjectDP
        monthCount={monthCount}
        monthSelect={monthSelect}
        yearSelect={yearSelect}
      />
    </div>
  )
}
