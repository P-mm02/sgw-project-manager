'use client'

import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import ProjectDetail from './_ProjectDetail/_ProjectDetail'
import ProjectReport from './ProjectReport/ProjectReport'
import DotsLoader from '@/loading/DotsLoader/DotsLoader'
import './page.css'

export default function ProjectDetailPageClient() {
  const { id } = useParams()
  const [project, setProject] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!id || typeof id !== 'string') return

    const fetchProject = async () => {
      try {
        const res = await fetch(`/api/projects/${id}`)
        if (!res.ok) throw new Error('ไม่พบโปรเจกต์')
        const data = await res.json()
        setProject(data)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'เกิดข้อผิดพลาด')
      } finally {
        setLoading(false)
      }
    }

    fetchProject()
  }, [id])

  if (loading) return <DotsLoader />
  if (error) return <div>❌ {error}</div>
  if (!project) return <div>ไม่พบข้อมูลโปรเจกต์</div>

  return (
    <div className="project-details-con">
      <div className="project-col-1">
        <ProjectDetail project={project} />
      </div>
      <div className="project-col-2">
        <ProjectReport project={project} />
      </div>
    </div>
  )
}
