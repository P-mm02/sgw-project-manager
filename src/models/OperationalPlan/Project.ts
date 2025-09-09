import {
  Schema,
  model,
  models,
  type Model,
  type Document,
  Types,
} from 'mongoose'

/* -------------------- Types -------------------- */
export interface ScheduleEntry {
  _id: Types.ObjectId
  startDate: string
  endDate: string
  memberIds: string[]
  note?: string
}

export interface ProjectAttrs {
  projectName: string
  schedule?: Array<
    Omit<ScheduleEntry, '_id'> & { _id?: Types.ObjectId | string }
  >
}

export interface ProjectDoc extends Document {
  projectName: string
  schedule: Types.DocumentArray<ScheduleEntry & Types.Subdocument>

  /** Convenience method to grab a schedule entry by subdoc id */
  getScheduleEntry(id: string): (ScheduleEntry & Types.Subdocument) | null
}

export interface ProjectModel extends Model<ProjectDoc> {
  fromPlain(input: ProjectAttrs): ProjectDoc
  updateScheduleEntryById(
    projectId: string,
    scheduleId: string,
    patch: Partial<Omit<ScheduleEntry, '_id'>>
  ): Promise<ProjectDoc | null>
}

/* -------------------- Subdocument Schema -------------------- */
const ScheduleEntrySchema = new Schema<ScheduleEntry>(
  {
    startDate: { type: String, required: true, trim: true },
    endDate: { type: String, required: true, trim: true },
    memberIds: { type: [String], required: true, default: [] },
    note: { type: String, trim: true },
  },
  {
    _id: true, // each schedule entry gets its own ObjectId
    id: false,
    versionKey: false,
  }
)

ScheduleEntrySchema.index({ startDate: 1 })
ScheduleEntrySchema.index({ endDate: 1 })

/* -------------------- Project Schema -------------------- */
const ProjectSchema = new Schema<ProjectDoc, ProjectModel>(
  {
    projectName: { type: String, required: true, trim: true, index: true },
    schedule: { type: [ScheduleEntrySchema], default: [] },
  },
  {
    timestamps: true,
    versionKey: false,
    toJSON: {
      virtuals: true,
      transform: (_doc, ret) => {
        // Map project _id -> id
        ret.id = ret._id?.toString()
        delete ret._id

        // Map schedule subdoc _id -> id
        if (Array.isArray(ret.schedule)) {
          ret.schedule = ret.schedule.map((s: any) => {
            if (s && s._id) {
              s.id = s._id.toString()
              delete s._id
            }
            return s
          })
        }
        return ret
      },
    },
    toObject: { virtuals: true },
  }
)

ProjectSchema.index({ projectName: 'text' })

/* -------------------- Instance Methods -------------------- */
ProjectSchema.methods.getScheduleEntry = function (
  this: ProjectDoc,
  id: string
) {
  return this.schedule.id(id) as (ScheduleEntry & Types.Subdocument) | null
}

/* -------------------- Statics -------------------- */
ProjectSchema.statics.fromPlain = function (input: ProjectAttrs) {
  return new this({
    projectName: input.projectName,
    schedule: input.schedule ?? [],
  })
}

ProjectSchema.statics.updateScheduleEntryById = async function (
  projectId: string,
  scheduleId: string,
  patch: Partial<Omit<ScheduleEntry, '_id'>>
) {
  const { _id, ...safePatch } = patch as any

  const updated = await this.findOneAndUpdate(
    { _id: new Types.ObjectId(projectId) },
    {
      $set: Object.fromEntries(
        Object.entries(safePatch).map(([k, v]) => [`schedule.$[elem].${k}`, v])
      ),
    },
    {
      new: true,
      arrayFilters: [{ 'elem._id': new Types.ObjectId(scheduleId) }],
      runValidators: true,
    }
  )
  return updated
}

/* -------------------- Model -------------------- */
const Project =
  (models.Project as ProjectModel) ||
  model<ProjectDoc, ProjectModel>(
    'Project',
    ProjectSchema,
    'plan-projects'
  )


export default Project
