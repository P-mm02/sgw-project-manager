'use client'

import React, { useEffect, useMemo, useState } from 'react'
import './page.css'
import BackButton from '@/components/BackButton'


type Member = {
  id: string
  name: string
  positions: string[]
  active: boolean
  createdAt: string
  updatedAt: string
}

type FormState = {
  name: string
  positions: string // comma-separated; backend normalizes
  active: boolean
}

const initialForm: FormState = { name: '', positions: '', active: true }

export default function AddMemberPage() {
  const [form, setForm] = useState<FormState>(initialForm)
  const [members, setMembers] = useState<Member[]>([])
  const [loading, setLoading] = useState(false)
  const [fetching, setFetching] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string>('')

  // inline edit states
  const [editingId, setEditingId] = useState<string | null>(null)
  const [editForm, setEditForm] = useState<FormState>(initialForm)
  const [savingEdit, setSavingEdit] = useState(false)
  const [deletingId, setDeletingId] = useState<string | null>(null)

  // simple search & filter
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

  // refetch when searching / filter changes (debounced)
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
          positions: form.positions, // backend normalizes to string[]
          active: form.active,
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
  const startEdit = (m: Member) => {
    setEditingId(m.id)
    setEditForm({
      name: m.name,
      positions: m.positions.join(', '),
      active: m.active,
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
          positions: editForm.positions, // backend normalizes
          active: editForm.active,
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

  const visibleMembers = useMemo(() => members, [members])

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

      {/* Add form */}
      <form className="op-card op-form" onSubmit={handleAdd}>
        <div className="op-form-row">
          <label htmlFor="name">ชื่อ</label>
          <input
            id="name"
            className="op-input"
            value={form.name}
            onChange={(e) => setForm((s) => ({ ...s, name: e.target.value }))}
            placeholder="เช่น เติ้ง"
            maxLength={50}
            required
          />
        </div>

        <div className="op-form-row">
          <label htmlFor="positions">ตำแหน่ง</label>
          <input
            id="positions"
            className="op-input"
            value={form.positions}
            onChange={(e) =>
              setForm((s) => ({ ...s, positions: e.target.value }))
            }
            placeholder="คั่นด้วยคอมมา เช่น หน.หน่วยเจาะ, ช่างสำรวจ"
          />
        </div>

        <div className="op-form-row inline">
          <label className="op-checkbox">
            <input
              type="checkbox"
              checked={form.active}
              onChange={(e) =>
                setForm((s) => ({ ...s, active: e.target.checked }))
              }
            />
            <span>Active</span>
          </label>
        </div>

        <div className="op-actions">
          <button className="btn primary" type="submit" disabled={loading}>
            {loading ? 'กำลังบันทึก…' : 'เพิ่มสมาชิก'}
          </button>
          <button
            className="btn ghost"
            type="button"
            onClick={() => {
              setForm(initialForm)
              resetAlerts()
            }}
            disabled={loading}
          >
            ล้างฟอร์ม
          </button>
        </div>
      </form>

      {/* Search & filter */}
      <div className="op-toolbar">
        <input
          className="op-input"
          placeholder="ค้นหาชื่อ…"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
        <select
          className="op-input"
          value={showActiveOnly}
          onChange={(e) => setShowActiveOnly(e.target.value as any)}
          title="Filter Active"
        >
          <option value="all">ทั้งหมด</option>
          <option value="true">Active เท่านั้น</option>
          <option value="false">Inactive เท่านั้น</option>
        </select>
        <button className="btn" onClick={fetchMembers} disabled={fetching}>
          {fetching ? 'กำลังโหลด…' : 'รีเฟรช'}
        </button>
      </div>

      {/* Members cards */}
      <div className="op-card-grid">
        {visibleMembers.length === 0 && (
          <div className="muted center">
            {' '}
            {fetching ? 'กำลังโหลด…' : 'ไม่มีข้อมูล'}{' '}
          </div>
        )}

        {visibleMembers.map((m) => {
          const isEditing = editingId === m.id
          return (
            <div key={m.id} className="member-card">
              {!isEditing ? (
                <>
                  <div className="member-header">
                    <h3 className="member-name">{m.name}</h3>
                    <span className={`badge ${m.active ? 'green' : 'gray'}`}>
                      {m.active ? 'Active' : 'Inactive'}
                    </span>
                  </div>

                  <div className="member-positions">
                    {m.positions && m.positions.length > 0 ? (
                      m.positions.map((p, idx) => (
                        <span key={idx} className="chip">
                          {p}
                        </span>
                      ))
                    ) : (
                      <span className="muted">ไม่ระบุ</span>
                    )}
                  </div>

                  <div className="row-actions">
                    <button className="btn" onClick={() => startEdit(m)}>
                      แก้ไข
                    </button>
                    <button
                      className="btn danger"
                      onClick={() => handleDelete(m.id, m.name)}
                      disabled={deletingId === m.id}
                    >
                      {deletingId === m.id ? 'กำลังลบ…' : 'ลบ'}
                    </button>
                  </div>
                </>
              ) : (
                <>
                  <div className="member-header">
                    <input
                      className="op-input"
                      value={editForm.name}
                      onChange={(e) =>
                        setEditForm((s) => ({ ...s, name: e.target.value }))
                      }
                    />
                    <label className="op-checkbox">
                      <input
                        type="checkbox"
                        checked={editForm.active}
                        onChange={(e) =>
                          setEditForm((s) => ({
                            ...s,
                            active: e.target.checked,
                          }))
                        }
                      />
                      Active
                    </label>
                  </div>

                  <div className="member-positions">
                    <input
                      className="op-input"
                      value={editForm.positions}
                      onChange={(e) =>
                        setEditForm((s) => ({
                          ...s,
                          positions: e.target.value,
                        }))
                      }
                      placeholder="คั่นด้วยคอมมา"
                    />
                  </div>

                  <div className="row-actions">
                    <button
                      className="btn primary"
                      onClick={saveEdit}
                      disabled={savingEdit}
                    >
                      {savingEdit ? 'กำลังบันทึก…' : 'บันทึก'}
                    </button>
                    <button
                      className="btn ghost"
                      onClick={cancelEdit}
                      disabled={savingEdit}
                    >
                      ยกเลิก
                    </button>
                  </div>
                </>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}
