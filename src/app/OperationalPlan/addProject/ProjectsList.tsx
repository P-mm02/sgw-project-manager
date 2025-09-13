// src/app/OperationalPlan/addProject/ProjectsList.tsx
'use client'

import React, { useMemo } from 'react'
import type {
  Member,
  Project,
  ScheduleEntry,
  ScheduleEntryInput,
} from './types'
import ProjectCard from './components/ProjectCard'
import ScheduleEditor from './components/ScheduleEditor'
import ScheduleAdder from './components/ScheduleAdder'

type EditingScheduleState = {
  projectId: string | null
  scheduleId: string | null
  form: ScheduleEntryInput
  saving: boolean
}

type AddingScheduleState = {
  projectId: string | null
  form: ScheduleEntryInput
  saving: boolean
}

type Props = {
  /** Data */
  projects: Project[]
  members: Member[]

  /** Helpers */
  memberName: (id: string) => string

  /** Expand per-project */
  expanded: Record<string, boolean>
  toggleExpand: (id: string) => void

  /** Project name edit */
  editingProjectId: string | null
  editProjectName: string
  startEditProject: (p: Project) => void
  cancelEditProject: () => void
  setEditProjectName: React.Dispatch<React.SetStateAction<string>>
  saveEditProject: () => void
  deleteProject: (p: Project) => Promise<void> | void

  /** Schedule edit */
  editingSchedule: EditingScheduleState
  startEditSchedule: (p: Project, s: ScheduleEntry) => void
  cancelEditSchedule: () => void
  setEditingSchedule: React.Dispatch<React.SetStateAction<EditingScheduleState>>
  saveEditSchedule: () => Promise<void>
  deleteSchedule: (p: Project, s: ScheduleEntry) => Promise<void>

  /** Add schedule for existing project */
  addingScheduleFor: AddingScheduleState
  startAddScheduleFor: (p: Project) => void
  cancelAddScheduleFor: () => void
  setAddingScheduleFor: React.Dispatch<
    React.SetStateAction<AddingScheduleState>
  >
  saveAddScheduleFor: () => Promise<void>
}

export default function ProjectsList({
  projects,
  members,
  memberName,

  expanded,
  toggleExpand,

  editingProjectId,
  editProjectName,
  startEditProject,
  cancelEditProject,
  setEditProjectName,
  saveEditProject,
  deleteProject,

  editingSchedule,
  startEditSchedule,
  cancelEditSchedule,
  setEditingSchedule,
  saveEditSchedule,
  deleteSchedule,

  addingScheduleFor,
  startAddScheduleFor,
  cancelAddScheduleFor,
  setAddingScheduleFor,
  saveAddScheduleFor,
}: Props) {
  const memberSelectSize = useMemo(
    () => Math.min(6, Math.max(3, members.length || 0)),
    [members.length]
  )

  return (
    <div className="op-card-grid">
      {projects.length === 0 && <div className="muted center">ไม่มีข้อมูล</div>}

      {projects.map((p) => {
        const isEditingProject = editingProjectId === p.id
        const isExpanded = !!expanded[p.id]

        // ✅ Build a unique member name summary for the card header
        const uniqueMemberIds = Array.from(
          new Set(p.schedule?.flatMap((s) => s.memberIds) ?? [])
        )
        const summaryMembers = uniqueMemberIds
          .map((id) => memberName(id))
          .filter((n) => n && n !== '—')
          .slice(0, 6) // show up to 6 names (tweak as needed)

        return (
          <div key={p.id} className="project-card">
            <ProjectCard
              project={p}
              isEditing={isEditingProject}
              isExpanded={isExpanded}
              editProjectName={editProjectName}
              onChangeProjectName={setEditProjectName}
              onToggleExpand={() => toggleExpand(p.id)}
              onStartEdit={() => startEditProject(p)}
              onCancelEdit={cancelEditProject}
              onSaveEdit={saveEditProject}
              onDelete={() => deleteProject(p)}
              summaryMembers={summaryMembers} // <-- now defined
            />

            {isExpanded && (
              <div className="schedule-list">
                {(!p.schedule || p.schedule.length === 0) && (
                  <div className="muted">ไม่มีตารางงาน</div>
                )}

                {p.schedule?.map((s) => {
                  const editingThis =
                    editingSchedule.projectId === p.id &&
                    editingSchedule.scheduleId === s.id

                  return (
                    <div key={s.id} className="schedule-item">
                      {!editingThis ? (
                        <>
                          <div className="schedule-line">
                            <div className="dates">
                              <span className="date-chip">{s.startDate}</span>
                              <span>→</span>
                              <span className="date-chip">{s.endDate}</span>
                            </div>

                            <div className="chips">
                              {s.memberIds.length > 0 ? (
                                s.memberIds.map((mid) => (
                                  <span key={mid} className="chip">
                                    {memberName(mid)}
                                  </span>
                                ))
                              ) : (
                                <span className="muted small">
                                  ไม่มีบุคลากร
                                </span>
                              )}
                            </div>

                            {s.note && <div className="note">📝 {s.note}</div>}
                          </div>

                          <div className="row-actions">
                            <button
                              type="button"
                              className="btn"
                              onClick={() => startEditSchedule(p, s)}
                            >
                              แก้ไขช่วงนี้
                            </button>
                            <button
                              type="button"
                              className="btn danger"
                              onClick={() => deleteSchedule(p, s)}
                            >
                              ลบช่วงนี้
                            </button>
                          </div>
                        </>
                      ) : (
                        <ScheduleEditor
                          members={members}
                          memberSelectSize={memberSelectSize}
                          editingSchedule={editingSchedule}
                          setEditingSchedule={setEditingSchedule}
                          onSave={saveEditSchedule}
                          onCancel={cancelEditSchedule}
                        />
                      )}
                    </div>
                  )
                })}

                {/* Add schedule to existing project */}
                {addingScheduleFor.projectId !== p.id ? (
                  <div className="op-actions">
                    <button
                      type="button"
                      className="btn"
                      onClick={() => startAddScheduleFor(p)}
                    >
                      + เพิ่มช่วงตารางงานให้โปรเจ็กต์นี้
                    </button>
                  </div>
                ) : (
                  <ScheduleAdder
                    members={members}
                    memberSelectSize={memberSelectSize}
                    addingScheduleFor={addingScheduleFor}
                    setAddingScheduleFor={setAddingScheduleFor}
                    onSave={saveAddScheduleFor}
                    onCancel={cancelAddScheduleFor}
                  />
                )}
              </div>
            )}
          </div>
        )
      })}
    </div>
  )
}
