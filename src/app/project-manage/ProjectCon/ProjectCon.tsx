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
import WorkTypeSelect from './WorkTypeSelect/WorkTypeSelect'



export default function DPprojects() {
  const [workType, setWorkType] = useState('all')

  const [monthCount, setMonthCount] = useState(1)
  const [monthSelect, setMonthSelect] = useState<number>(() => 0)
  const [yearSelect, setYearSelect] = useState<number>(() => 2025)
  
  const [projectDataOri, setProjectOriData] = useState<ProjectType[]>([])
  const [projectData, setProjectData] = useState<ProjectType[]>([])

  
  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const res = await fetch('/api/projects')
        const { data } = await res.json()
        setProjectOriData(data)
        console.log('fetchfetchfetchfetchfetchfetchfetch')
      } catch (error) {
        console.error('Failed to fetch projects:', error)
      }
    }
    fetchProjects()
  }, [])
  
  useEffect(() => {
    const filterProjects = projectDataOri.filter(
      (project: ProjectType) =>
        workType === 'all' || project.workType === workType
    )
    setProjectData(filterProjects)
  }, [workType, projectDataOri])

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
        <WorkTypeSelect setWorkType={setWorkType} />
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
