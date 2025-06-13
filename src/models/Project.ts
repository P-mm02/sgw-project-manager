import { Schema, models, model, InferSchemaType } from 'mongoose'

const ProjectSchema = new Schema(
  {
    projectName: String,
    location: String,
    mapLink: String,
    client: String,
    supervisor: String,
    projectWorth: Number,
    status: String,
    workType: String,
    planWorkDayStart: String,
    planWorkDayEnd: String,
    actualWorkDayStart: String,
    actualWorkDayEnd: String,
    tags: [String],
    report: String,
    documents: [String],
  },
  { timestamps: true }
)

export type ProjectType = InferSchemaType<typeof ProjectSchema>

const Project = models.Project || model('Project', ProjectSchema)
export default Project
