const { PrismaClient } = require('@prisma/client')
const bcrypt = require('bcryptjs')

const prisma = new PrismaClient()

async function createTestUsers() {
  try {
    console.log('🔄 Creating test users...')

    // Test users data
    const testUsers = [
      {
        name: 'Senior User',
        email: 'senior@test.com',
        password: 'password123',
        role: 'SENIOR',
        phoneNumber: '555-0101'
      },
      {
        name: 'Volunteer User',
        email: 'volunteer@test.com',
        password: 'password123',
        role: 'VOLUNTEER',
        phoneNumber: '555-0102'
      },
      {
        name: 'Admin User',
        email: 'admin@test.com',
        password: 'password123',
        role: 'ADMIN',
        phoneNumber: '555-0103'
      }
    ]

    for (const userData of testUsers) {
      // Check if user already exists
      const existingUser = await prisma.user.findUnique({
        where: { email: userData.email }
      })

      if (existingUser) {
        console.log(`⚠️  User ${userData.email} already exists, skipping...`)
        continue
      }

      // Hash password
      const hashedPassword = await bcrypt.hash(userData.password, 12)

      // Create user
      const user = await prisma.user.create({
        data: {
          name: userData.name,
          email: userData.email,
          password: hashedPassword,
          role: userData.role,
          phoneNumber: userData.phoneNumber
        }
      })

      // Create role-specific profile
      if (userData.role === 'VOLUNTEER') {
        await prisma.volunteerProfile.create({
          data: {
            userId: user.id,
            expertise: ['Technology', 'Computer Basics'],
            availabilitySchedule: {
              monday: ['09:00-17:00'],
              tuesday: ['09:00-17:00'],
              wednesday: ['09:00-17:00'],
              thursday: ['09:00-17:00'],
              friday: ['09:00-17:00']
            },
            bio: 'Experienced volunteer ready to help seniors with technology.',
            skillLevel: 'INTERMEDIATE'
          }
        })
      } else if (userData.role === 'SENIOR') {
        await prisma.seniorProfile.create({
          data: {
            userId: user.id,
            techComfortLevel: 'BEGINNER',
            interests: ['Email', 'Video Calls', 'Online Shopping'],
            preferredContactMethod: 'EMAIL'
          }
        })
      }

      console.log(`✅ Created user: ${userData.email} (${userData.role})`)
    }

    console.log('🎉 Test users created successfully!')
    console.log('\n📝 Login credentials:')
    console.log('Senior: senior@test.com / password123')
    console.log('Volunteer: volunteer@test.com / password123')
    console.log('Admin: admin@test.com / password123')

  } catch (error) {
    console.error('❌ Error creating test users:', error)
  } finally {
    await prisma.$disconnect()
  }
}

createTestUsers()
