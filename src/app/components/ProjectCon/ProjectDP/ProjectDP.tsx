'use client'
import React, { useMemo } from 'react'
import projectData from '@/data/projectData.json'
import './ProjectDP.css'
import DateCtrl from '../DateCtrl/DateCtrl'
import { generateMonths, Month } from './generateMonths/generateMonths'
import { parse, differenceInCalendarDays } from 'date-fns'

type MonthDPProps = {
  monthCount: number
  monthSelect: number
  yearSelect: number
}

export default function ProjectDP({ monthCount, monthSelect, yearSelect }: MonthDPProps) {  
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
  return (
    <>
      {projectData.map((project, index) => (
        <div className="row-project" key={index}>
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
