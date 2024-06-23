import { PrismaClient } from '@prisma/client';
import { hash } from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  await seedUsers();
  await seedGreenBeans();
  await seedRoastProfiles();
  await seedRoastLogs();
  await seedCuppingNotes();

  console.log('Seed data created successfully');
}

async function seedUsers() {
  const hashedPassword = await hash('password123', 10);
  await prisma.user.upsert({
    where: { email: 'user@example.com' },
    update: {},
    create: {
      email: 'user@example.com',
      name: 'John Doe',
      password: hashedPassword,
      role: 'user',
    },
  });
}

async function seedGreenBeans() {
  await prisma.greenBean.createMany({
    data: [
      {
        origin: 'Ethiopia',
        variety: 'Heirloom',
        processingMethod: 'Washed',
        quantity: 10,
        purchaseDate: new Date('2023-01-01'),
      },
      {
        origin: 'Colombia',
        variety: 'Caturra',
        processingMethod: 'Natural',
        quantity: 15,
        purchaseDate: new Date('2023-02-15'),
      },
    ],
    skipDuplicates: true,
  });
}

async function seedRoastProfiles() {
  const user = await prisma.user.findUnique({
    where: { email: 'user@example.com' },
  });
  if (!user) throw new Error('User not found');

  await prisma.roastProfile.createMany({
    data: [
      {
        name: 'Light Roast Profile',
        data: {
          /* Add your roast profile data here */
        },
        userId: user.id,
      },
      {
        name: 'Medium Roast Profile',
        data: {
          /* Add your roast profile data here */
        },
        userId: user.id,
      },
    ],
    skipDuplicates: true,
  });
}

async function seedRoastLogs() {
  const user = await prisma.user.findUnique({
    where: { email: 'user@example.com' },
  });
  if (!user) throw new Error('User not found');

  const profile = await prisma.roastProfile.findFirst();
  if (!profile) throw new Error('Roast profile not found');

  await prisma.roastLog.createMany({
    data: [
      {
        date: new Date('2023-06-01'),
        beanType: 'Ethiopia Yirgacheffe',
        profileId: profile.id,
        equipment: 'Sample Roaster 1kg',
        notes: 'First crack at 9 minutes, development time 2 minutes',
        userId: user.id,
        weight: 250, // Added weight field
      },
      {
        date: new Date('2023-06-15'),
        beanType: 'Colombia Huila',
        profileId: profile.id,
        equipment: 'Sample Roaster 1kg',
        notes: 'Smooth roast, nice caramel notes',
        userId: user.id,
        weight: 300, // Added weight field
      },
    ],
    skipDuplicates: true,
  });
}

async function seedCuppingNotes() {
  const roastLogs = await prisma.roastLog.findMany();

  for (const log of roastLogs) {
    await prisma.cuppingNote.create({
      data: {
        roastLogId: log.id,
        aroma: Math.floor(Math.random() * 3) + 7,
        flavor: Math.floor(Math.random() * 3) + 7,
        aftertaste: Math.floor(Math.random() * 3) + 7,
        acidity: Math.floor(Math.random() * 3) + 7,
        body: Math.floor(Math.random() * 3) + 7,
        balance: Math.floor(Math.random() * 3) + 7,
        overall: Math.floor(Math.random() * 3) + 7,
        notes: 'Bright acidity, floral notes with a hint of citrus',
      },
    });
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
