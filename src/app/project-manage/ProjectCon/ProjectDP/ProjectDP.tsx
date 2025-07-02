'use client'
import React, { useMemo } from 'react'
import './ProjectDP.css'
import './ProjectDP-mobile.css'
import { generateMonths, Month } from './generateMonths/generateMonths'
import { parse, differenceInCalendarDays } from 'date-fns'
import ProjectActionButtons from './ProjectActionButtons/ProjectActionButtons'
import { deleteProject } from '@/lib/date/deleteProject'
import MonthDP from '../monthDP/monthDP'
import { useRouter } from 'next/navigation'
import type { ProjectType } from '@/types/ProjectType'
import dynamic from 'next/dynamic'
import Skeleton from '@/loading/Skeleton/Skeleton'

type MonthDPProps = {
  monthCount: number
  monthSelect: number
  yearSelect: number
  projectData: ProjectType[]
  setProjectData: React.Dispatch<React.SetStateAction<ProjectType[]>>
}


export default function ProjectDP({
  monthCount,
  monthSelect,
  yearSelect,
  projectData,
  setProjectData,
}: MonthDPProps) {
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

  const DateCtrl = dynamic(() => import('./DateCtrl/DateCtrl'), {
          ssr: false,
          loading: () => <Skeleton />,
        })
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
        <div className="row-month hidden-mobile">
          <MonthDP monthCount={monthCount} monthSelect={monthSelect} />
        </div>
      </div>
      {projectData.map((project, index) => (
        <div
          className="row-project"
          key={index}
          onClick={() => router.push(`/projects/${project._id}`)}
        >
          <div className="projectInfoAndBtnWraper">
            <div className="projectInfoWraper">
              <div className="project-name">{project.projectName}</div>
              <div className="project-location">{project.location}</div>
            </div>
            <ProjectActionButtons
              projectId={project._id}
              mapLink={project.mapLink ?? ''}
              onDelete={async (id) => {
                const success = await deleteProject(id)
                if (success) {
                  setProjectData((prev) => prev.filter((p) => p._id !== id))
                }
              }}
            />
          </div>

          <div className="project-working-day">
            <span>
              แผนปฎิบัติงาน{' '}
              {getDayDiff(
                project.planWorkDayStart ?? '',
                project.planWorkDayEnd ?? ''
              )}{' '}
              วัน
            </span>
            <span>
              ปฎิบัติงานจริง{' '}
              {getDayDiff(
                project.actualWorkDayStart ?? '',
                project.actualWorkDayEnd ?? ''
              )}{' '}
              วัน
            </span>
          </div>
          <div className="project-plan-con hidden-mobile">
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
