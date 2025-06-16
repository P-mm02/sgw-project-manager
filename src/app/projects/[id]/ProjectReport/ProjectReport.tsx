'use client'

import { useState } from 'react'
import type { ProjectType } from '@/models/Project'
import './ProjectReport.css'

type WorkLogEntry = {
  recorder: string
  recordText: string
  recordTime: Date
}
export default function ProjectReport({ project }: { project: ProjectType }) {
  const [recorder, setRecorder] = useState('')
  const [recordText, setRecordText] = useState('')
  const [logs, setLogs] = useState<WorkLogEntry[]>(
    [...(project.workLog || [])].reverse().map((log) => ({
      recorder: log.recorder || '',
      recordText: log.recordText || '',
      recordTime: log.recordTime ? new Date(log.recordTime) : new Date(),
    }))
  )
  
  

  const handleAddLog = () => {
    if (!recorder || !recordText) return

    const newLog: WorkLogEntry = {
      recorder,
      recordText,
      recordTime: new Date(),
    }

    setLogs((prevLogs) => [newLog, ...prevLogs])
    setRecorder('')
    setRecordText('')
  }
  

  return (
    <div className="project-report-container">
      <h2 className="project-report-title">บันทึกการทํางาน และคำสั่ง</h2>

      {/* ✅ Input Section */}
      <div className="report-section-input">
        <label className="report-label">ผู้บันทึก หรือผู้สั่งการ:</label>
        <input
          type="text"
          className="input-field"
          value={recorder}
          onChange={(e) => setRecorder(e.target.value)}
        />
        <label className="report-label">รายงานการทำงาน:</label>
        <textarea
          className="input-field"
          value={recordText}
          onChange={(e) => setRecordText(e.target.value)}
        />
        <button onClick={handleAddLog} className="add-log-btn">
          ➕ เพิ่มบันทึก
        </button>
      </div>

      {/* ✅ Newly Added Logs (appear immediately under input) */}
      {logs.map((log, index) => (
        <div className="report-section" key={`new-${index}`}>
          <div className="report-recordTime">
            <p className="report-label text-wrap">
              เวลาที่บันทึก:&nbsp;
              {new Date(log.recordTime).toLocaleString('th-TH', {
                dateStyle: 'full',
                timeStyle: 'medium',
              })}
            </p>
          </div>
          <div className="report-recorder">
            <p className="report-label text-wrap">ผู้บันทึก: {log.recorder}</p>
          </div>
          <div className="report-con">
            <div className="report-recordText">
              <p className="report-label text-wrap">
                รายงานการทํางาน: {log.recordText}
              </p>
            </div>
          </div>
        </div>
      ))}
      {logs.length === 0 && <p className="report-content">ไม่มีข้อมูลรายงาน</p>}
    </div>
  )
}
