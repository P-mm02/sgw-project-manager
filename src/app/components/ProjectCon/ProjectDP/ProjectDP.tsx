import React from 'react'
import projectData from '@/data/projectData.json'
import './ProjectDP.css'
import DateCtrl from '../DateCtrl/DateCtrl'

type MonthDPProps = {
  monthCount: number
  monthSelect: number
}

function getDaysInFebruary(year: number): number {
  return new Date(year, 2, 0).getDate()
}

// Get current year
const currentYear = new Date().getFullYear();
const daysInFeb = getDaysInFebruary(currentYear);

console.log(`February ${currentYear} has ${daysInFeb} days.`);

export default function ProjectDP({ monthCount, monthSelect }: MonthDPProps) {
  return (
    <>
      {projectData.map((project, index) => (
        <div className="row-project" key={index}>
          <div className="project-name">{project.name}</div>
          <div className="project-location">{project.location}</div>
          <div className="project-plan col">
            <DateCtrl monthCount={monthCount} monthSelect={monthSelect} />
          </div>
        </div>
      ))}
    </>
  )
}
