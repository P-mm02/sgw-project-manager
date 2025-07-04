import { NextResponse } from 'next/server'
import { connectToDB } from '@/lib/mongoose'
import Employee from '@/models/Employee'

// GET /api/employees
export async function GET() {
  try {
    await connectToDB()
    const employees = await Employee.find().sort({ createdAt: -1 })
    return NextResponse.json(employees)
  } catch (error) {
    console.error('❌ Failed to fetch employees:', error)
    return NextResponse.json({ error: 'Failed to fetch employees' }, { status: 500 })
  }
}
