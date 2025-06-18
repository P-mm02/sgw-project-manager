import mongoose from 'mongoose'

let cached = (global as any).mongoose || { conn: null, promise: null }

export async function connectToDB() {
  if (cached.conn) return cached.conn

  if (!cached.promise) {
    cached.promise = mongoose.connect(process.env.MONGODB_URI!, {
      dbName: 'sgw',
      bufferCommands: false,
      maxPoolSize: 10,
    })
  }

  try {
    cached.conn = await cached.promise
    ;(global as any).mongoose = cached
    console.log('✅ Mongoose connected (cached)')
    return cached.conn
  } catch (e) {
    console.error('❌ Mongoose connection error:', e)
    throw e
  }
}
