import { Schema, model, models } from 'mongoose'

const ProjectSchema = new Schema(
  {
    projectName: String,
    location: String,
    mapLink: String,
    client: String,
    supervisor: String,
    projectWorth: String,
    status: String,
    workType: String,
    planWorkDayStart: String,
    planWorkDayEnd: String,
    actualWorkDayStart: String,
    actualWorkDayEnd: String,
    tags: [String],
    report: String,
    documents: [String],
    workLog: [
      {
        recorder: String,
        recordTime: Date,
        recordText: String,
      },
    ],
  },
  { timestamps: true }
)

const Project = models.Project || model('Project', ProjectSchema)
export default Project
