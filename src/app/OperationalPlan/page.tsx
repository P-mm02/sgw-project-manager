'use client'
import React, { useState, useMemo } from 'react'
import membersData from './member.json'
import projectsData from './project.json'
import './page.css'

// Define types for our data
type Member = {
  id: string
  name: string
}

type ScheduleEntry = {
  date: string
  memberId: string
}

type Project = {
  projectId: string
  projectName: string
  schedule: ScheduleEntry[]
}

// Main component
const OperationalPlanPage = () => {
  // Set current date to the specified date for consistency
  const [currentDate, setCurrentDate] = useState(new Date('2025-09-05'))
  const [view, setView] = useState<'project' | 'member'>('project') // 'project' or 'member'

  const members: Member[] = membersData
  const projects: Project[] = projectsData

  const daysInMonth = useMemo(() => {
    const year = currentDate.getFullYear()
    const month = currentDate.getMonth()
    const date = new Date(year, month, 1)
    const days = []
    while (date.getMonth() === month) {
      days.push(new Date(date))
      date.setDate(date.getDate() + 1)
    }
    return days
  }, [currentDate])

  const memberMap = useMemo(() => {
    return new Map(members.map((m) => [m.id, m.name]))
  }, [members])

  const handleMonthChange = (offset: number) => {
    setCurrentDate((prevDate) => {
      const newDate = new Date(prevDate)
      // Set to the first of the month to avoid issues with different day counts
      newDate.setDate(1)
      newDate.setMonth(newDate.getMonth() + offset)
      return newDate
    })
  }

  const getDayInitial = (date: Date) => {
    const days = ['S', 'M', 'T', 'W', 'T', 'F', 'S']
    return days[date.getDay()]
  }

  const isToday = (date: Date) => {
    const today = new Date('2025-09-05T00:00:00') // Use a consistent "today" for demonstration
    return (
      date.getDate() === today.getDate() &&
      date.getMonth() === today.getMonth() &&
      date.getFullYear() === today.getFullYear()
    )
  }

  const renderProjectView = () => (
    <div className="table-container">
      <table className="operational-table">
        <thead>
          <tr>
            <th className="sticky-col header-project">Project</th>
            {daysInMonth.map((day) => (
              <th
                key={day.toISOString()}
                className={`header-date ${isToday(day) ? 'today' : ''}`}
              >
                <div className="date-cell-content">
                  <span className="day-initial">{getDayInitial(day)}</span>
                  <span className="day-number">{day.getDate()}</span>
                </div>
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {projects.map((project) => (
            <tr key={project.projectId}>
              <td className="sticky-col cell-project">{project.projectName}</td>
              {daysInMonth.map((day) => {
                const yyyyMmDd = day.toISOString().split('T')[0]
                const scheduleEntry = project.schedule.find(
                  (s) => s.date === yyyyMmDd
                )
                const memberName = scheduleEntry
                  ? memberMap.get(scheduleEntry.memberId)
                  : ''
                return (
                  <td
                    key={day.toISOString()}
                    className={`data-cell ${memberName ? 'has-data' : ''} ${
                      isToday(day) ? 'today-cell' : ''
                    }`}
                  >
                    {memberName && (
                      <div className="member-tag">{memberName}</div>
                    )}
                  </td>
                )
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )

  const renderMemberView = () => {
    const projectScheduleMap = new Map<string, string>() // Key: 'YYYY-MM-DD-memberId', Value: projectName
    projects.forEach((p) => {
      p.schedule.forEach((s) => {
        const key = `${s.date}-${s.memberId}`
        projectScheduleMap.set(key, p.projectName)
      })
    })

    return (
      <div className="table-container">
        <table className="operational-table">
          <thead>
            <tr>
              <th className="sticky-col header-project">Member</th>
              {daysInMonth.map((day) => (
                <th
                  key={day.toISOString()}
                  className={`header-date ${isToday(day) ? 'today' : ''}`}
                >
                  <div className="date-cell-content">
                    <span className="day-initial">{getDayInitial(day)}</span>
                    <span className="day-number">{day.getDate()}</span>
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {members.map((member) => (
              <tr key={member.id}>
                <td className="sticky-col cell-project">{member.name}</td>
                {daysInMonth.map((day) => {
                  const yyyyMmDd = day.toISOString().split('T')[0]
                  const key = `${yyyyMmDd}-${member.id}`
                  const projectName = projectScheduleMap.get(key)
                  return (
                    <td
                      key={day.toISOString()}
                      className={`data-cell ${projectName ? 'has-data' : ''} ${
                        isToday(day) ? 'today-cell' : ''
                      }`}
                    >
                      {projectName && (
                        <div className="project-tag">{projectName}</div>
                      )}
                    </td>
                  )
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    )
  }

  return (
    <div className="plan-container">
      <header className="plan-header">
        <h1>Operational Plan</h1>
        <div className="controls">
          <div className="month-selector">
            <button onClick={() => handleMonthChange(-1)}>&lt;</button>
            <span>
              {currentDate.toLocaleString('default', {
                month: 'long',
                year: 'numeric',
              })}
            </span>
            <button onClick={() => handleMonthChange(1)}>&gt;</button>
          </div>
          <div className="view-switcher">
            <button
              className={view === 'project' ? 'active' : ''}
              onClick={() => setView('project')}
            >
              Project View
            </button>
            <button
              className={view === 'member' ? 'active' : ''}
              onClick={() => setView('member')}
            >
              Member View
            </button>
          </div>
        </div>
      </header>

      <main>
        {view === 'project' ? renderProjectView() : renderMemberView()}
      </main>
    </div>
  )
}

export default OperationalPlanPage
