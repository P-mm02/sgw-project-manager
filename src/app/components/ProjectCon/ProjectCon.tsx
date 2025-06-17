'use client'
import './ProjectCon.css'
import { useState } from 'react'
import Link from 'next/link'
import MonthBtnCtrl from './MonthBtnCtrl/MonthBtnCtrl'
import ProjectDP from './ProjectDP/ProjectDP'
import MonthSelectBtn from './MonthSelectBtn/MonthSelectBtn'


type ProjectConProps = {  
  workType: string
}

export default function DPprojects({workType}:ProjectConProps) {
  const [monthCount, setMonthCount] = useState(1)
  const [monthSelect, setMonthSelect] = useState<number>(() => 0)
  const [yearSelect, setYearSelect] = useState<number>(() => 2025)

  return (
    <div className="projects-container">
      <div className="top-row-btn-con">
        <MonthBtnCtrl
          monthCount={monthCount}
          setMonthCount={setMonthCount}
          setMonthSelect={setMonthSelect}
        />
        <div className="add-project-btn-wrapper">
          <Link href="/projects/AddProject" className="add-project-btn">
            เพิ่มโปรเจค
          </Link>
        </div>
      </div>
      <MonthSelectBtn
        monthSelect={monthSelect}
        setMonthSelect={setMonthSelect}
        yearSelect={yearSelect}
        setYearSelect={setYearSelect}
        monthCount={monthCount}
      />

      <ProjectDP
        monthCount={monthCount}
        monthSelect={monthSelect}
        yearSelect={yearSelect}
        workType={workType}
      />
    </div>
  )
}
