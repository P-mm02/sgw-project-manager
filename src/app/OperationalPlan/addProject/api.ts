// src/app/OperationalPlan/addProject/api.ts
import type { Member, Project, ScheduleEntryInput } from './types'

export async function getMembers(): Promise<Member[]> {
  const res = await fetch('/api/OperationalPlan/member/get', {
    cache: 'no-store',
  })
  const data = await res.json()
  if (!res.ok) throw new Error(data?.error || 'โหลดรายชื่อไม่สำเร็จ')
  const list: Member[] = (data.members || [])
    .map((m: any) => ({
      id: m.id ?? m._id ?? '',
      name: m.name ?? '',
      positions: m.positions ?? [],
      active: Boolean(m.active),
    }))
    .filter((m: Member) => m.id && m.name)
  return list
}

export async function getProjects(search: string): Promise<Project[]> {
  const params = new URLSearchParams()
  if (search.trim()) params.set('search', search.trim())
  const url =
    '/api/OperationalPlan/project/get' + (params.toString() ? `?${params}` : '')
  const res = await fetch(url, { cache: 'no-store' })
  const data = await res.json()
  if (!res.ok) throw new Error(data?.error || 'โหลดโปรเจ็กต์ไม่สำเร็จ')
  return (data.projects || []) as Project[]
}

export async function addProject(payload: {
  projectName: string
  schedule: ScheduleEntryInput[]
}) {
  const res = await fetch('/api/OperationalPlan/project/add', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  })
  const data = await res.json()
  if (!res.ok) throw new Error(data?.error || 'เพิ่มโปรเจ็กต์ไม่สำเร็จ')
  return data
}

export async function editProjectName(id: string, projectName: string) {
  const res = await fetch('/api/OperationalPlan/project/edit', {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ id, projectName }),
  })
  const data = await res.json()
  if (!res.ok) throw new Error(data?.error || 'อัปเดตโปรเจ็กต์ไม่สำเร็จ')
  return data
}

export async function deleteProjectById(id: string) {
  const res = await fetch(`/api/OperationalPlan/project/delete/${id}`, {
    method: 'DELETE',
  })
  const data = await res.json()
  if (!res.ok) throw new Error(data?.error || 'ลบไม่สำเร็จ')
  return data
}

export async function editSchedule(
  projectId: string,
  scheduleId: string,
  patch: ScheduleEntryInput
) {
  const res = await fetch('/api/OperationalPlan/project/schedule/edit', {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ projectId, scheduleId, patch }),
  })
  const data = await res.json()
  if (!res.ok) throw new Error(data?.error || 'อัปเดตตารางงานไม่สำเร็จ')
  return data
}

export async function addSchedule(
  projectId: string,
  entry: ScheduleEntryInput
) {
  const res = await fetch('/api/OperationalPlan/project/schedule/add', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ projectId, entry }),
  })
  const data = await res.json()
  if (!res.ok) throw new Error(data?.error || 'เพิ่มตารางงานไม่สำเร็จ')
  return data
}

export async function deleteScheduleById(
  projectId: string,
  scheduleId: string
) {
  const res = await fetch(
    `/api/OperationalPlan/project/schedule/delete/${scheduleId}?projectId=${projectId}`,
    { method: 'DELETE' }
  )

  const data = await res.json()
  if (!res.ok) throw new Error(data?.error || 'ลบตารางงานไม่สำเร็จ')
  return data
}
