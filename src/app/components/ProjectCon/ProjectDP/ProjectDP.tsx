'use client'
import React, { useEffect, useMemo, useState } from 'react'
import './ProjectDP.css'
import DateCtrl from './DateCtrl/DateCtrl'
import { generateMonths, Month } from './generateMonths/generateMonths'
import { parse, differenceInCalendarDays } from 'date-fns'
import ProjectActionButtons from './ProjectActionButtons/ProjectActionButtons'
import { deleteProject } from '@/lib/deleteProject'
import MonthDP from '../monthDP/monthDP'
import { useRouter } from 'next/navigation'



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
  const [projectData, setProjectData] = useState<any[]>([])

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const res = await fetch('/api/projects')
        const { data } = await res.json()

        // 🔍 Filter only drilling projects
        const drillingProjects = data.filter(
          (project: any) => project.workType === workType
        )

        setProjectData(drillingProjects)
      } catch (error) {
        console.error('Failed to fetch projects:', error)
      }
    }

    fetchProjects()
  }, [])

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
            projectId={project._id}
            mapLink={project.mapLink}
            onDelete={async (id) => {
              const success = await deleteProject(id)
              if (success) {
                setProjectData((prev) => prev.filter((p) => p._id !== id))
              }
            }}
          />

          <div className="project-name">{project.projectName}</div>
          <div className="project-location">{project.location}</div>
          <div className="project-working-day">
            <span>
              แผนปฎิบัติงาน{' '}
              {getDayDiff(project.planWorkDayStart, project.planWorkDayEnd)} วัน
            </span>
            <span>
              ปฎิบัติงานจริง{' '}
              {getDayDiff(project.actualWorkDayStart, project.actualWorkDayEnd)}{' '}
              วัน
            </span>
          </div>
          <div className="project-plan col">
            <DateCtrl
              months={months}
              monthCount={monthCount}
              planRange={{
                start: project.planWorkDayStart,
                end: project.planWorkDayEnd,
              }}
              actualRange={{
                start: project.actualWorkDayStart,
                end: project.actualWorkDayEnd,
              }}
            />
          </div>
        </div>
      ))}
    </>
  )
}
