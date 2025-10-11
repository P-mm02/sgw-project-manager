// src/app/OperationalPlan/addProject/api.ts
import type { Member, Project, ScheduleEntryInput } from './types'

const normalizeHexColor = (v: unknown, fallback = '#e2e8f0'): string => {
  if (typeof v !== 'string') return fallback
  let s = v.trim().toLowerCase()
  if (s.startsWith('0x')) s = s.slice(2)
  if (s.startsWith('#')) s = s.slice(1)
  if (/^[0-9a-f]{3}$/.test(s))
    s = s
      .split('')
      .map((ch) => ch + ch)
      .join('')
  if (!/^[0-9a-f]{6}$/.test(s)) return fallback
  return `#${s}`
}

export async function getMembers(): Promise<Member[]> {
  const res = await fetch('/api/OperationalPlan/member/get', {
    cache: 'no-store',
  })
  const data = await res.json()
  if (!res.ok) throw new Error(data?.error || 'โหลดรายชื่อไม่สำเร็จ')

  const list: Member[] = (data.members || [])
    .map((m: any) => ({
      _id: m._id ?? m.id ?? '', // <-- populate _id here
      name: m.name ?? '',
      positions: Array.isArray(m.positions) ? m.positions : [],
      active: Boolean(m.active),
      indexNumber: m.indexNumber ?? 0,
      backgroundColor: normalizeHexColor(
        m.backgroundColor ?? m['background-color'] ?? '#e2e8f0'
      ),
    }))
    .filter((m: Member) => m._id && m.name) // <-- filter by _id

  //console.log('Fetched members:', list)
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
