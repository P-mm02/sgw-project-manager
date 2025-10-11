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

/** Normalize hex color -> '#rrggbb' (fallback to '#e2e8f0') */
function normalizeHexColor(v: unknown): string {
  const fallback = '#e2e8f0'
  if (typeof v !== 'string') return fallback
  let s = v.trim().toLowerCase()
  if (s.startsWith('0x')) s = s.slice(2)
  if (s.startsWith('#')) s = s.slice(1)
  if (/^[0-9a-f]{3}$/.test(s))
    s = s
      .split('')
      .map((c) => c + c)
      .join('')
  if (/^[0-9a-f]{6}$/.test(s)) return `#${s}`
  return fallback
}

/* ---------- Types ---------- */
export interface MemberAttrs {
  _id?: string
  name: string
  positions?: string[] | string
  active?: boolean
  indexNumber?: number
  backgroundColor?: string
}

export interface MemberDoc extends Document {
  name: string
  positions: string[]
  active: boolean
  indexNumber: number
  backgroundColor: string
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

    indexNumber: {
      type: Number,
      default: 0,
      min: 0,
    },
    backgroundColor: {
      type: String,
      default: '#e2e8f0',
      set: normalizeHexColor,
      validate: {
        validator: (v: string) => /^#[0-9a-f]{6}$/i.test(v),
        message: 'backgroundColor must be a hex like #rrggbb',
      },
    },
  },
  {
    timestamps: true,
    versionKey: false,
    toJSON: {
      // turn off virtuals so alias fields aren't emitted
      virtuals: false,
      transform: (doc, ret) => {
        // add id manually
        ret._id = doc._id?.toString()
        // DO NOT add kebab-case:
        // delete ret._id for cleanliness
        delete ret._id
        return ret
      },
    },
    // toObject can mirror toJSON or be left as-is depending on usage
    toObject: { virtuals: false },
  }
)

/* Indexes */
MemberSchema.index({ name: 1 })
MemberSchema.index({ name: 'text' })
MemberSchema.index({ indexNumber: 1 }) // for ordering lists

/* Static: build from flexible input */
MemberSchema.statics.fromPlain = function (input: MemberAttrs) {
  const indexNumber = (input as any)['index-number'] ?? input.indexNumber ?? 0
  const backgroundColor =
    (input as any)['background-color'] ?? input.backgroundColor

  return new this({
    name: input.name,
    positions: input.positions, // normalized by setter
    active: input.active ?? true,
    indexNumber,
    backgroundColor, // normalized by setter
  })
}

/* ---------- Model ---------- */
const Member =
  (models.Member as MemberModel) ||
  model<MemberDoc, MemberModel>('Member', MemberSchema)

export default Member
