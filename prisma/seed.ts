import { PrismaClient } from '@prisma/client'

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
            logoInitials: 'RCA',
            primaryColor: '#16A34A',
            subscribersCount: 14290,
        },
    })

    const wac = await prisma.club.create({
        data: {
            name: 'Wydad Athletic Club',
            slug: 'wydad-ac',
            city: 'Casablanca',
            logoInitials: 'WAC',
            primaryColor: '#DC2626',
            subscribersCount: 9850,
        },
    })

    console.log('✅ Clubs injected successfully.')

    // 3. Inject test authentication profiles
    const adminUser = await prisma.user.create({
        data: {
            email: 'admin@teamhub.ma',
            password: 'password123', // Hardcoded safely for localized testing phase
            firstName: 'Nasr-eddine',
            lastName: 'Hajji',
            role: 'CLUB_ADMIN',
        },
    })

    const fanUser = await prisma.user.create({
        data: {
            email: 'fan@teamhub.ma',
            password: 'password123',
            firstName: 'Alex',
            lastName: 'Morgan',
            role: 'FAN',
        },
    })

    console.log('✅ Auth test profiles credentials created.')

    // 4. Link some sample dynamic posts
    await prisma.post.createMany({
        data: [
            {
                title: 'Matchday updates against FAR Rabat',
                content: 'Welcome back supporters! Here is our tactical approach blueprint layout updates for the weekend classic match line-ups grid.',
                isPremium: false,
                clubId: rca.id,
            },
            {
                title: '🔒 Exclusive Tactical Breakdown: 3-5-2 Formation',
                content: 'Premium locked details highlighting technical dressing room instructions, midfield rotations, and counters schemes.',
                isPremium: true,
                clubId: rca.id,
            },
            {
                title: 'New Training Kits Revealed',
                content: 'Check out the home collection colors framework designed natively for the premium athletic cycles.',
                isPremium: false,
                clubId: wac.id,
            },
        ],
    })

    // 5. Establish an active fan membership node link
    await prisma.subscription.create({
        data: {
            status: 'ACTIVE',
            userId: fanUser.id,
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