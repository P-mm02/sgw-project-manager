'use client'

import { useState } from 'react'
import type { ProjectType } from '@/types/ProjectType'
import './ProjectReport.css'

type WorkLogEntry = {
  recorder: string
  recordText: string
  recordTime: Date
  recordPriority: string
}
export default function ProjectReport({ project }: { project: ProjectType }) {
  const [recorder, setRecorder] = useState('')
  const [recordText, setRecordText] = useState('')
  const [logs, setLogs] = useState<WorkLogEntry[]>(
    [...(project.workLog || [])].reverse().map((log) => ({
      recorder: log.recorder || '',
      recordText: log.recordText || '',
      recordTime: log.recordTime ? new Date(log.recordTime) : new Date(),
      recordPriority: log.recordPriority || '',
    }))
  )
  const [recordPriority, setRecordPriority] = useState('')
  const [editingIndex, setEditingIndex] = useState<number | null>(null)
  const [editRecorder, setEditRecorder] = useState('')
  const [editRecordText, setEditRecordText] = useState('')


  const handleAddLog = async () => {
    if (!recorder || !recordText) return
    const newLog: WorkLogEntry = {
      recorder,
      recordText,
      recordTime: new Date(),
      recordPriority,
    }
    try {
      const res = await fetch(`/api/projects/${project._id}/add-log`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newLog),
      })
      setLogs((prevLogs) => [newLog, ...prevLogs])
      setRecorder('')
      setRecordText('')
      const result = await res.json()
      if (result.success) {
        console.log('Add Log successfully');        
      } else {
        console.error('API failed:', result.error)
      }
    } catch (err) {
      console.error('Failed to send log:', err)
    }
  }

  const handleDeleteLog = async (indexToDelete: number) => {
    const confirmDelete = confirm('คุณแน่ใจหรือว่าต้องการลบบันทึกนี้?')
    if (!confirmDelete) return

    setLogs((prevLogs) => prevLogs.filter((_, i) => i !== indexToDelete))

    const logToDelete = logs[indexToDelete]
    if (!logToDelete) return

    try {
      const res = await fetch(`/api/projects/${project._id}/delete-log`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ recordTime: logToDelete.recordTime }),
      })

      const result = await res.json()
      if (!result.success) {
        console.error('Backend delete failed:', result.message)
        return
      }

    } catch (error) {
      console.error('Failed to delete log:', error)
    }
  }

  const handleSaveEdit = async (index: number) => {
    const updatedLog = {
      ...logs[index],
      recorder: editRecorder,
      recordText: editRecordText,
    }

    const updatedLogs = [...logs]
    updatedLogs[index] = updatedLog
    setLogs(updatedLogs)
    setEditingIndex(null)

    try {
      const res = await fetch(`/api/projects/${project._id}/edit-log`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          recordTime: logs[index].recordTime, // use timestamp as key
          recorder: editRecorder,
          recordText: editRecordText,
        }),
      })

      const result = await res.json()
      if (!result.success) {
        console.error('Edit failed:', result.message)
      }
    } catch (err) {
      console.error('Error editing log:', err)
    }
  }
  

  return (
    <div className="project-report-container">
      <h1 className="project-report-title">บันทึกการทํางาน และคำสั่ง</h1>

      {/* ✅ Input Section */}
      <div className="report-section-input">
        <label className="report-label">ผู้บันทึก / ผู้สั่งการ:</label>
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
        <label className="report-label">ความสำคัญ:</label>
        <div className="priority-buttons">
          {[
            { value: 'medium', label: 'ปกติ' },
            { value: 'high', label: 'สำคัญ' },
            { value: 'critical', label: 'เร่งด่วน' },
          ].map(({ value, label }) => (
            <button
              key={value}
              type="button"
              className={`priority-btn ${
                recordPriority === value ? `active ${value}` : ''
              }`}
              onClick={() => setRecordPriority(value)}
            >
              {label}
            </button>
          ))}
        </div>
        <button
          onClick={() => {
            const confirmed = window.confirm(
              'คุณแน่ใจหรือไม่ว่าต้องการเพิ่มบันทึก?'
            )
            if (confirmed) handleAddLog()
          }}
          className="add-log-btn"
        >
          ➕ เพิ่มบันทึก
        </button>
      </div>

      {/* ✅ Newly Added Logs (appear immediately under input) */}
      {logs.map((log, index) => (
        <div className="report-section" key={`new-${index}`}>
          <div className="report-recordTime">
            <div className="report-recorder">
              <p className="report-label text-wrap">
                ผู้บันทึก / ผู้สั่งการ: {log.recorder}
              </p>
            </div>
            <p className="report-label text-wrap">
              เวลาที่บันทึก:&nbsp;
              {new Date(log.recordTime).toLocaleString('th-TH', {
                dateStyle: 'full',
                timeStyle: 'medium',
              })}
            </p>
            <span className={`priority-label priority-${log.recordPriority}`}>
              {(() => {
                switch (log.recordPriority) {
                  case 'medium':
                    return 'ปกติ'
                  case 'high':
                    return 'สำคัญ'
                  case 'critical':
                    return 'เร่งด่วน'
                  default:
                    return 'ไม่ระบุ'
                }
              })()}
            </span>
          </div>
          <div className="report-con">
            <div className="report-recordText">
              <p className="report-label text-wrap">
                รายงานการทํางาน: {log.recordText}
              </p>
            </div>
          </div>
          {editingIndex === index ? (
            <>
              <input
                className="input-field"
                value={editRecorder}
                onChange={(e) => setEditRecorder(e.target.value)}
              />
              <textarea
                className="input-field"
                value={editRecordText}
                onChange={(e) => setEditRecordText(e.target.value)}
              />
              <button
                className="save-workLog"
                onClick={() => handleSaveEdit(index)}
              >
                💾 บันทึก
              </button>
              <button
                className="cancel-workLog"
                onClick={() => setEditingIndex(null)}
              >
                ❌ ยกเลิก
              </button>
            </>
          ) : (
            <>
              <button
                className="edit-workLog"
                onClick={() => {
                  setEditingIndex(index)
                  setEditRecorder(log.recorder)
                  setEditRecordText(log.recordText)
                }}
              >
                แก้ไข
              </button>
              <button
                className="delete-workLog"
                onClick={() => handleDeleteLog(index)}
              >
                ลบ
              </button>
            </>
          )}
        </div>
      ))}
      {logs.length === 0 && <p className="report-content">ไม่มีข้อมูลรายงาน</p>}
    </div>
  )
}
