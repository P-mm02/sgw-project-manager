import { notFound } from 'next/navigation'
import { getProjectById } from '@/lib/project-utils'
import ProjectDetail from './projectDetail/projectDetail'
import ProjectReport from './ProjectReport/ProjectReport'
import "./page.css";

type ProjectDetailPageProps = {
  params: { id: string }
}

export default async function ProjectDetailPage({
  params,
}: ProjectDetailPageProps) {
  const projectID = await params
  const project = await getProjectById(projectID.id)
  if (!project) notFound()

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
