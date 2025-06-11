import mongoose from 'mongoose'

let isConnected = false

export async function connectToDB() {
  if (isConnected) return

  try {
    await mongoose.connect(process.env.MONGODB_URI!, {
      dbName: 'sgw', // <-- use your actual DB name
    })
    isConnected = true
    console.log('✅ Mongoose connected')
  } catch (error) {
    console.error('❌ Mongoose connection error:', error)
    throw error
  }
}
