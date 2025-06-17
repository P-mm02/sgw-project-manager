'use client'
import React, { useEffect, useMemo, useState } from 'react'
import './ProjectDP.css'
import { generateMonths, Month } from './generateMonths/generateMonths'
import { parse, differenceInCalendarDays } from 'date-fns'
import ProjectActionButtons from './ProjectActionButtons/ProjectActionButtons'
import { deleteProject } from '@/lib/deleteProject'
import MonthDP from '../monthDP/monthDP'
import { useRouter } from 'next/navigation'
import type { ProjectType } from '@/models/Project'
import dynamic from 'next/dynamic'
import Skeleton from '@/loading/Skeleton/Skeleton'
import type { ComponentType } from 'react'

type MonthDPProps = {
  monthCount: number
  monthSelect: number
  yearSelect: number
  workType: string
}

export default function ProjectDP({
  monthCount,
  monthSelect,
  yearSelect,
  workType,
}: MonthDPProps) {
  const [projectData, setProjectData] = useState<ProjectType[]>([])

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const res = await fetch('/api/projects')
        const { data } = await res.json()

        // 🔍 Filter only drilling projects
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

  const months: Month[] = useMemo(() => {
    return generateMonths(monthCount, monthSelect, yearSelect)
  }, [monthCount, monthSelect, yearSelect])

  const getDayDiff = (start: string, end: string) => {
    return (
      differenceInCalendarDays(
        parse(end, 'yyyyMMdd', new Date()),
        parse(start, 'yyyyMMdd', new Date())
      ) + 1
    )
  }
  
  const router = useRouter()

  /* const DateCtrl = dynamic(() => import('./DateCtrl/DateCtrl'), {
    ssr: false, // optional: skip server-side rendering
    loading: () => <Skeleton/>, // optional loading UI
  })
 */
  
  const DateCtrl = dynamic(
    () =>
      new Promise<{ default: ComponentType<any> }>((resolve) => {
        setTimeout(() => resolve(import('./DateCtrl/DateCtrl')), 2000)
      }),
    {
      ssr: false,
      loading: () => <Skeleton />,
    }
  )
  

/*   console.time('ProjectDP')
  // render or fetch
  console.timeEnd('ProjectDP') */
  return (
    <>
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
      {projectData.map((project, index) => (
        <div
          className="row-project"
          key={index}
          onClick={() => router.push(`/projects/${project._id}`)}
        >
          <ProjectActionButtons
            projectId={project._id.toString()}
            mapLink={project.mapLink ?? ''}
            onDelete={async (id) => {
              const success = await deleteProject(id)
              if (success) {
                setProjectData((prev) =>
                  prev.filter((p) => p._id.toString() !== id)
                )
              }
            }}
          />

          <div className="project-name">{project.projectName}</div>
          <div className="project-location">{project.location}</div>
          <div className="project-working-day">
            <span>
              แผนปฎิบัติงาน{' '}
              {getDayDiff(project.planWorkDayStart ?? '', project.planWorkDayEnd ?? '')} วัน
            </span>
            <span>
              ปฎิบัติงานจริง{' '}
              {getDayDiff(project.actualWorkDayStart ?? '', project.actualWorkDayEnd ?? '')}{' '}
              วัน
            </span>
          </div>
          <div className="project-plan col">
            <DateCtrl
              months={months}
              monthCount={monthCount}
              planRange={{
                start: project.planWorkDayStart ?? '',
                end: project.planWorkDayEnd ?? '',
              }}
              actualRange={{
                start: project.actualWorkDayStart ?? '',
                end: project.actualWorkDayEnd ?? '',
              }}
            />
          </div>
        </div>
        
      ))}
    </>
  )
}
