import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { fullName, email, password, role, phone } = body

    // Validate required fields
    if (!fullName || !email || !password || !role) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    // Validate role
    if (!['SENIOR', 'VOLUNTEER', 'ADMIN'].includes(role)) {
      return NextResponse.json(
        { error: 'Invalid role' },
        { status: 400 }
      )
    }

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email }
    })

    if (existingUser) {
      return NextResponse.json(
        { error: 'User with this email already exists' },
        { status: 409 }
      )
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 12)

    // Create user
    const user = await prisma.user.create({
      data: {
        name: fullName,
        email,
        password: hashedPassword,
        role: role as 'SENIOR' | 'VOLUNTEER' | 'ADMIN',
        phoneNumber: phone || null
      }
    })

    // Create role-specific profile
    if (role === 'VOLUNTEER') {
      await prisma.volunteerProfile.create({
        data: {
          userId: user.id,
          expertise: ['Technology', 'Computer Basics'],
          certifications: [],
          availability: {
            monday: ['09:00-17:00'],
            tuesday: ['09:00-17:00'],
            wednesday: ['09:00-17:00'],
            thursday: ['09:00-17:00'],
            friday: ['09:00-17:00']
          }
        }
      })
    } else if (role === 'SENIOR') {
      await prisma.seniorProfile.create({
        data: {
          userId: user.id,
          interests: ['Email', 'Video Calls', 'Online Shopping'],
          learningGoals: ['Learn basic computer skills']
        }
      })
    }

    // Return user data (without password)
    const { password: _, ...userWithoutPassword } = user

    return NextResponse.json({
      message: 'User created successfully',
      user: userWithoutPassword
    })

  } catch (error) {
    console.error('Registration error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
