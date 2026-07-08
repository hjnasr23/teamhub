import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
    console.log('🔄 Starting database seeding runtime...')

    // 1. Clean existing records safely to avoid token duplicates
    await prisma.subscription.deleteMany()
    await prisma.post.deleteMany()
    await prisma.club.deleteMany()
    await prisma.user.deleteMany()

    // 2. Inject initial Moroccan clubs dataset
    const rca = await prisma.club.create({
        data: {
            name: 'Raja Club Athletic',
            slug: 'raja-ca',
            city: 'Casablanca',
            primaryColor: '#16A34A',
            subscribersCount: 14290,
        },
    })

    const wac = await prisma.club.create({
        data: {
            name: 'Wydad Athletic Club',
            slug: 'wydad-ac',
            city: 'Casablanca',
            primaryColor: '#DC2626',
            subscribersCount: 9850,
        },
    })

    console.log('✅ Clubs injected successfully.')

    // 3. Hash passwords securely
    const hashedPassword = await bcrypt.hash('password123', 10)
    const superAdminPassword = await bcrypt.hash('SuperAdmin2026!', 10)

    // 4. Inject test authentication profiles
    const adminUser = await prisma.user.create({
        data: {
            email: 'admin@teamhub.ma',
            password: hashedPassword,
            firstName: 'Nasr-eddine',
            lastName: 'Hajji',
            role: 'CLUB_ADMIN',
        },
    })

    const fanUser = await prisma.user.create({
        data: {
            email: 'fan@teamhub.ma',
            password: hashedPassword,
            firstName: 'Alex',
            lastName: 'Morgan',
            role: 'FAN',
        },
    })

    const superAdminUser = await prisma.user.create({
        data: {
            email: 'superadmin@teamhub.ma',
            password: superAdminPassword,
            firstName: 'Super',
            lastName: 'Admin',
            role: 'SUPER_ADMIN',
        },
    })

    console.log('✅ Auth test profiles credentials created securely.')

    // 5. Link some sample dynamic posts
    await prisma.post.createMany({
        data: [
            {
                title: 'Matchday updates against FAR Rabat',
                content: 'Welcome back supporters! Here is our tactical approach blueprint layout updates for the weekend classic match line-ups grid.',
                visibility: 'PUBLIC',
                clubId: rca.id,
            },
            {
                title: '🔒 Exclusive Tactical Breakdown: 3-5-2 Formation',
                content: 'Premium locked details highlighting technical dressing room instructions, midfield rotations, and counters schemes.',
                visibility: 'PREMIUM',
                clubId: rca.id,
            },
            {
                title: 'New Training Kits Revealed',
                content: 'Check out the home collection colors framework designed natively for the premium athletic cycles.',
                visibility: 'PUBLIC',
                clubId: wac.id,
            },
        ],
    })

    // 6. Establish an active fan membership node link
    await prisma.subscription.create({
        data: {
            status: 'ACTIVE',
            fanId: fanUser.id,
            clubId: rca.id,
        },
    })

    console.log('✨ Data seeding processing sequence finalized successfully!')
}

main()
    .catch((e) => {
        console.error('❌ Seeding process error detected:', e)
        process.exit(1)
    })
    .finally(async () => {
        await prisma.$disconnect()
    })