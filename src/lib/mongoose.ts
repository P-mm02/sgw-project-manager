import mongoose from 'mongoose'

declare global {
  var mongooseConnection: boolean
}

global.mongooseConnection = global.mongooseConnection || false

export async function connectToDB() {
  if (global.mongooseConnection) return

  try {
    await mongoose.connect(process.env.MONGODB_URI!, {
      dbName: 'sgw',
      bufferCommands: false,
      maxPoolSize: 10,
    })

    global.mongooseConnection = true
    console.log('✅ Mongoose connected')
  } catch (error) {
    console.error('❌ Mongoose connection error:', error)
    throw error
  }
}
