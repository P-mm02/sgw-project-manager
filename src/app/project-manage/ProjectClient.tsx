'use client'
import './ProjectCon/ProjectCon.css'
import dynamic from 'next/dynamic'
import DotsLoader from '@/loading/DotsLoader/DotsLoader'

const ProjectCon = dynamic(() => import('./ProjectCon/ProjectCon'), {
  loading: () => <DotsLoader />,
  ssr: false,
})

export default function ProjectClient() {
  return <ProjectCon />
}
