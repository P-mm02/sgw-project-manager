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
import DotsLoader from '@/loading/DotsLoader/DotsLoader'


export default function ProjectCon() {
  const [loading, setLoading] = useState(true)
  const [workType, setWorkType] = useState('all')
  const [monthCount, setMonthCount] = useState(1)
  const [monthSelect, setMonthSelect] = useState<number>(() => 0)
  const [yearSelect, setYearSelect] = useState<number>(() => 2025)
  const [serverProjects, setserverProjects] = useState<ProjectType[]>([])
  const [projectData, setProjectData] = useState<ProjectType[]>([])
  
  useEffect(() => {
    const fetchProjects = async () => {
      setLoading(true)
      try {
        const res = await fetch('/api/edge-projects')
        const { data } = await res.json()
        if (!Array.isArray(data)) {
          console.error('Invalid project data:', data)
          return
        }
        setserverProjects(data)
        
      } catch (error) {
        console.error('Failed to fetch projects:', error)
      } finally {
        setLoading(false)
      }
    }
    fetchProjects()
  }, [])
  
  useEffect(() => {
    if (workType === 'all') {
      setProjectData(serverProjects)
    } else {
      setProjectData(serverProjects.filter((p) => p.workType === workType))
    }
  }, [workType, serverProjects])
  

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

      {loading ? (
        <DotsLoader/>
      ) : (
        <ProjectDP
          monthCount={monthCount}
          monthSelect={monthSelect}
          yearSelect={yearSelect}
          projectData={projectData}
          setProjectData={setProjectData}
        />
      )}
    </div>
  )
}
