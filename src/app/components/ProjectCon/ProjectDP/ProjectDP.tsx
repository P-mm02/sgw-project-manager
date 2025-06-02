'use client'
import React, { useMemo } from 'react'
import projectData from '@/data/projectData.json'
import './ProjectDP.css'
import DateCtrl from '../DateCtrl/DateCtrl'
import { generateMonths, Month } from './generateMonths/generateMonths'

type MonthDPProps = {
  monthCount: number
  monthSelect: number
}

export default function ProjectDP({ monthCount, monthSelect }: MonthDPProps) {
  const selectYear = new Date().getFullYear()
  const months: Month[] = useMemo(() => {
    return generateMonths(monthCount, monthSelect, selectYear)
  }, [monthCount, monthSelect, selectYear])
  return (
    <>
      {projectData.map((project, index) => (
        <div className="row-project" key={index}>
          <div className="project-name">{project.name}</div>
          <div className="project-location">{project.location}</div>
          <div className="project-plan col">
            <DateCtrl months={months} monthCount={monthCount} />
          </div>
        </div>
      ))}
    </>
  )
}
