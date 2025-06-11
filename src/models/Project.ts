import mongoose, { Schema, models, model } from 'mongoose'

const ProjectSchema = new Schema(
  {
    projectName: String,
    location: String,
    latlng: {
      lat: Number,
      lng: Number,
    },
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

const Project = models.Project || model('Project', ProjectSchema)
export default Project
