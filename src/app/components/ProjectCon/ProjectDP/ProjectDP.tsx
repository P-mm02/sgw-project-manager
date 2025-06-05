'use client'
import React, { useMemo } from 'react'
import projectData from '@/data/projectData.json'
import './ProjectDP.css'
import DateCtrl from '../DateCtrl/DateCtrl'
import { generateMonths, Month } from './generateMonths/generateMonths'

type MonthDPProps = {
  monthCount: number
  monthSelect: number
  yearSelect: number
}

export default function ProjectDP({ monthCount, monthSelect, yearSelect }: MonthDPProps) {  
  const months: Month[] = useMemo(() => {
    return generateMonths(monthCount, monthSelect, yearSelect)
  }, [monthCount, monthSelect, yearSelect])
  return (
    <>
      {projectData.map((project, index) => (
        <div className="row-project" key={index}>
          <div className="project-name">{project.name}</div>
          <div className="project-location">{project.location}</div>
          <div className="project-working-day">
            <span>
              แผนปฎิบัติงาน{' '}
              {Number(project.planWorkDayEnd) -
                Number(project.planWorkDayStart)}{' '}
              วัน
            </span>
            <span>
              ปฎิบัติงานจริง{' '}
              {Number(project.actualWorkDayEnd) -
                Number(project.actualWorkDayStart)}{' '}
              วัน
            </span>
          </div>
          <div className="project-plan col">
            <DateCtrl months={months} monthCount={monthCount} />
          </div>
        </div>
      ))}
    </>
  )
}
