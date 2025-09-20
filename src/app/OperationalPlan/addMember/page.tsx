'use client'

import React, { useEffect, useMemo, useState } from 'react'
import './page.css'
import BackButton from '@/components/BackButton'
import CircleSpining from '@/loading/CircleSpining/CircleSpining'
import { MemberAttrs } from '@/models/OperationalPlan/Member'
import { normalizeHexColor, toInt } from './lib/memberUtils'
import MemberForm, { type FormState } from './components/MemberForm'
import MemberList from './components/MemberList'
import Toolbar from './components/Toolbar'

const initialForm: FormState = {
  name: '',
  positions: '',
  active: true,
  indexNumber: 0,
  backgroundColor: '#e2e8f0',
}

export default function AddMemberPage() {
  const [form, setForm] = useState<FormState>(initialForm)
  const [members, setMembers] = useState<MemberAttrs[]>([])
  const [loading, setLoading] = useState(false)
  const [fetching, setFetching] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string>('')

  // inline edit states
  const [editingId, setEditingId] = useState<string | null>(null)
  const [editForm, setEditForm] = useState<FormState>(initialForm)
  const [savingEdit, setSavingEdit] = useState(false)
  const [deletingId, setDeletingId] = useState<string | null>(null)

  // search & filter
  const [query, setQuery] = useState('')
  const [showActiveOnly, setShowActiveOnly] = useState<
    'all' | 'true' | 'false'
  >('all')

  const resetAlerts = () => {
    setError(null)
    setSuccess('')
  }

  const fetchMembers = async () => {
    try {
      setFetching(true)
      const params = new URLSearchParams()
      if (query.trim()) params.set('search', query.trim())
      if (showActiveOnly !== 'all') params.set('active', showActiveOnly)
      const url =
        '/api/OperationalPlan/member/get' +
        (params.toString() ? `?${params.toString()}` : '')
      const res = await fetch(url, { cache: 'no-store' })
      const data = await res.json()
      if (!res.ok) throw new Error(data?.error || 'Failed to fetch members')
      setMembers(data.members || [])
    } catch (e: any) {
      setError(e.message || 'โหลดรายชื่อไม่สำเร็จ')
    } finally {
      setFetching(false)
    }
  }

  useEffect(() => {
    fetchMembers()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    const t = setTimeout(fetchMembers, 300)
    return () => clearTimeout(t)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [query, showActiveOnly])

  // ADD
  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault()
    resetAlerts()
    if (!form.name.trim()) {
      setError('กรุณากรอกชื่อ')
      return
    }
    try {
      setLoading(true)
      const res = await fetch('/api/OperationalPlan/member/add', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: form.name.trim(),
          positions: form.positions,
          active: form.active,
          'index-number': form.indexNumber,
          'background-color': normalizeHexColor(form.backgroundColor),
        }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data?.error || 'เพิ่มสมาชิกไม่สำเร็จ')
      setSuccess(`เพิ่มสมาชิก: ${data.member?.name || form.name} สำเร็จ`)
      setForm(initialForm)
      fetchMembers()
    } catch (e: any) {
      setError(e.message || 'เพิ่มสมาชิกไม่สำเร็จ')
    } finally {
      setLoading(false)
    }
  }

  // EDIT
  const startEdit = (m: MemberAttrs) => {
    setEditingId(m.id as string)
    setEditForm({
      name: m.name,
      positions: Array.isArray(m.positions)
        ? m.positions.join(', ')
        : (m.positions as any) || '',
      active: m.active ?? true,
      indexNumber: (m as any).indexNumber ?? (m as any)['index-number'] ?? 0,
      backgroundColor:
        (m as any).backgroundColor ??
        (m as any)['background-color'] ??
        '#e2e8f0',
    })
    resetAlerts()
  }

  const cancelEdit = () => {
    setEditingId(null)
    setEditForm(initialForm)
  }

  const saveEdit = async () => {
    if (!editingId) return
    resetAlerts()
    if (!editForm.name.trim()) {
      setError('กรุณากรอกชื่อ')
      return
    }
    try {
      setSavingEdit(true)
      const res = await fetch('/api/OperationalPlan/member/edit', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: editingId,
          name: editForm.name.trim(),
          positions: editForm.positions,
          active: editForm.active,
          'index-number': editForm.indexNumber,
          'background-color': normalizeHexColor(editForm.backgroundColor),
        }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data?.error || 'อัปเดตไม่สำเร็จ')
      setSuccess(`อัปเดตสมาชิก: ${data.member?.name || editForm.name} สำเร็จ`)
      setEditingId(null)
      setEditForm(initialForm)
      fetchMembers()
    } catch (e: any) {
      setError(e.message || 'อัปเดตไม่สำเร็จ')
    } finally {
      setSavingEdit(false)
    }
  }

  // DELETE
  const handleDelete = async (id: string, name: string) => {
    resetAlerts()
    const ok = confirm(`ลบสมาชิก "${name}" ?`)
    if (!ok) return
    try {
      setDeletingId(id)
      const res = await fetch(`/api/OperationalPlan/member/delete/${id}`, {
        method: 'DELETE',
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data?.error || 'ลบไม่สำเร็จ')
      setSuccess(`ลบสมาชิก: ${name} สำเร็จ`)
      fetchMembers()
    } catch (e: any) {
      setError(e.message || 'ลบไม่สำเร็จ')
    } finally {
      setDeletingId(null)
    }
  }

  // sort by index-number
  const visibleMembers = useMemo(() => {
    const list = members.slice()
    list.sort((a: any, b: any) => {
      const ai = a.indexNumber ?? a['index-number'] ?? 0
      const bi = b.indexNumber ?? b['index-number'] ?? 0
      return ai - bi
    })
    return list
  }, [members])

  return (
    <div className="op-container">
      <BackButton />
      <h1 className="op-title">บุคลากร</h1>

      {(error || success) && (
        <div className="op-alerts">
          {error && <div className="op-alert error">{error}</div>}
          {success && <div className="op-alert success">{success}</div>}
        </div>
      )}

      <MemberForm
        form={form}
        setForm={setForm}
        loading={loading}
        onSubmit={handleAdd}
        membersLength={members.length}
      />

      <Toolbar
        query={query}
        setQuery={setQuery}
        showActiveOnly={showActiveOnly}
        setShowActiveOnly={setShowActiveOnly}
        fetching={fetching}
        onRefresh={fetchMembers}
      />

      {fetching ? (
        <div className="fetching-CircleSpining">
          <CircleSpining />
        </div>
      ) : null}

      <MemberList
        members={visibleMembers}
        editingId={editingId}
        editForm={editForm}
        setEditForm={setEditForm}
        startEdit={startEdit}
        cancelEdit={cancelEdit}
        saveEdit={saveEdit}
        deletingId={deletingId}
        handleDelete={handleDelete}
      />
    </div>
  )
}
