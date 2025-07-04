import { NextResponse } from 'next/server'
import { connectToDB } from '@/lib/mongoose'
import Employee from '@/models/Employee'
import employeeData from '@/data/employee_seed_data.json'

export async function GET() {
  try {
    await connectToDB()

    const existingCount = await Employee.countDocuments()
    if (existingCount > 0) {
      return NextResponse.json({ message: '👥 Employees already seeded', count: existingCount })
    }

    await Employee.insertMany(employeeData)
    return NextResponse.json({ message: '✅ Employees seeded successfully', count: employeeData.length })
  } catch (error) {
    console.error('❌ Seed error:', error)
    return NextResponse.json({ error: 'Failed to seed employees' }, { status: 500 })
  }
}
