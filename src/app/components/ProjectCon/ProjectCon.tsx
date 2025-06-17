'use client'
import './ProjectCon.css'
import { useState, useEffect} from 'react'
import Link from 'next/link'
import MonthBtnCtrl from './MonthBtnCtrl/MonthBtnCtrl'
import ProjectDP from './ProjectDP/ProjectDP'
import MonthSelectBtn from './MonthSelectBtn/MonthSelectBtn'
import type { ProjectType } from '@/models/Project'
//import dynamic from 'next/dynamic'
//import Skeleton from '@/loading/Skeleton/Skeleton'


type ProjectConProps = {  
  workType: string
}

export default function DPprojects({workType}:ProjectConProps) {
  const [monthCount, setMonthCount] = useState(1)
  const [monthSelect, setMonthSelect] = useState<number>(() => 0)
  const [yearSelect, setYearSelect] = useState<number>(() => 2025)
  
  const [projectData, setProjectData] = useState<ProjectType[]>([])

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const res = await fetch('/api/projects')
        const { data } = await res.json()

        const drillingProjects = data.filter(
          (project: ProjectType) => project.workType === workType
        )
        setProjectData(drillingProjects)
      } catch (error) {
        console.error('Failed to fetch projects:', error)
      }
    }

    fetchProjects()
  }, [workType])

  /* const ProjectDP = dynamic(() => import('./ProjectDP/ProjectDP'), {
    ssr: false, // optional: skip server-side rendering
    loading: () => <Skeleton />, // optional loading UI
  }) */
  
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
        projectData={projectData}
        setProjectData={setProjectData}
      />
    </div>
  )
}
