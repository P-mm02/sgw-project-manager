import { Schema, model, models, type Model, type Document } from 'mongoose'

/** Normalize incoming position(s) to string[] */
function toStringArray(v: unknown): string[] {
  if (Array.isArray(v)) return v.filter(Boolean).map((s) => String(s).trim())
  if (typeof v === 'string')
    return v
      .split(',')
      .map((s) => s.trim())
      .filter(Boolean)
  return []
}

/* ---------- Types ---------- */
export interface MemberAttrs {
  name: string
  /** Accepts string or string[] on create/update; normalized to string[] */
  positions?: string[] | string
  active?: boolean
}

export interface MemberDoc extends Document {
  name: string
  positions: string[]
  active: boolean
  createdAt: Date
  updatedAt: Date
}

export interface MemberModel extends Model<MemberDoc> {
  fromPlain(input: MemberAttrs): MemberDoc
}

/* ---------- Schema ---------- */
const MemberSchema = new Schema<MemberDoc, MemberModel>(
  {
    name: { type: String, required: true, trim: true, maxlength: 50 },
    positions: { type: [String], default: ['ไม่ระบุ'], set: toStringArray },
    active: { type: Boolean, default: true, index: true },
  },
  {
    timestamps: true,
    versionKey: false,
    toJSON: {
      virtuals: true,
      transform: (_doc, ret) => {
        ret.id = ret._id?.toString()
        delete ret._id
        return ret
      },
    },
    toObject: { virtuals: true },
  }
)

/* Indexes */
MemberSchema.index({ name: 1 })
MemberSchema.index({ name: 'text' })

/* Static: build from flexible input */
MemberSchema.statics.fromPlain = function (input: MemberAttrs) {
  return new this({
    name: input.name,
    positions: input.positions, // normalized by setter
    active: input.active ?? true,
  })
}

/* ---------- Model ---------- */
const Member =
  (models.Member as MemberModel) ||
  model<MemberDoc, MemberModel>('Member', MemberSchema)

export default Member
