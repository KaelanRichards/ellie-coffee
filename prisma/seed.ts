import { PrismaClient } from '@prisma/client';
import { hash } from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  await seedUsers();
  await seedGreenBeans();
  await seedEquipment();
  await seedRoastProfiles();
  await seedRoastLogs();
  await seedCuppingNotes();
  await seedExperiments();

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

async function seedEquipment() {
  await prisma.equipment.createMany({
    data: [
      {
        name: 'Sample Roaster 1kg',
        type: 'Roaster',
        manufacturer: 'Coffee Tech',
        model: 'FZ-94',
        serialNumber: 'CT12345',
        purchaseDate: new Date('2022-01-01'),
        lastMaintenance: new Date('2023-01-01'),
        nextMaintenance: new Date('2023-07-01'),
        notes: 'Regular maintenance required every 6 months',
      },
      {
        name: 'Grinder Pro',
        type: 'Grinder',
        manufacturer: 'Mahlkonig',
        model: 'EK43',
        serialNumber: 'MK67890',
        purchaseDate: new Date('2022-03-15'),
        lastMaintenance: new Date('2023-03-15'),
        nextMaintenance: new Date('2023-09-15'),
        notes: 'Burrs replacement due in 6 months',
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
        userId: user.id,
        firstCrack: 240,
        developmentTime: 60,
        endTemperature: 410,
        totalRoastTime: 300,
        chargeTemperature: 200,
        dryingPhaseEnd: 180,
        firstCrackEnd: 270,
        coolingStarted: 300,
        airflowSettings: JSON.stringify([
          { time: 0, value: 50 },
          { time: 180, value: 75 },
          { time: 240, value: 100 },
        ]),
        drumSpeed: 50,
        heatSettings: JSON.stringify([
          { time: 0, value: 80 },
          { time: 180, value: 70 },
          { time: 240, value: 60 },
        ]),
        notes: 'Light roast with floral notes and bright acidity',
      },
      {
        name: 'Medium Roast Profile',
        userId: user.id,
        firstCrack: 270,
        developmentTime: 90,
        endTemperature: 435,
        totalRoastTime: 360,
        chargeTemperature: 200,
        dryingPhaseEnd: 210,
        firstCrackEnd: 300,
        coolingStarted: 360,
        airflowSettings: JSON.stringify([
          { time: 0, value: 50 },
          { time: 210, value: 75 },
          { time: 270, value: 100 },
        ]),
        drumSpeed: 55,
        heatSettings: JSON.stringify([
          { time: 0, value: 85 },
          { time: 210, value: 75 },
          { time: 270, value: 65 },
        ]),
        notes: 'Balanced medium roast with caramel sweetness',
      },
    ],
    skipDuplicates: true,
  });

  // Seed TemperatureReadings for each RoastProfile
  const profiles = await prisma.roastProfile.findMany();
  for (const profile of profiles) {
    await prisma.temperatureReading.createMany({
      data: [
        { roastProfileId: profile.id, time: 0, temperature: 200 },
        { roastProfileId: profile.id, time: 60, temperature: 300 },
        { roastProfileId: profile.id, time: 120, temperature: 350 },
        { roastProfileId: profile.id, time: 180, temperature: 380 },
        { roastProfileId: profile.id, time: 240, temperature: 400 },
        { roastProfileId: profile.id, time: 300, temperature: 410 },
      ],
    });
  }
}

async function seedRoastLogs() {
  const user = await prisma.user.findUnique({
    where: { email: 'user@example.com' },
  });
  if (!user) throw new Error('User not found');

  const profile = await prisma.roastProfile.findFirst();
  if (!profile) throw new Error('Roast profile not found');

  const equipment = await prisma.equipment.findFirst();
  if (!equipment) throw new Error('Equipment not found');

  await prisma.roastLog.createMany({
    data: [
      {
        date: new Date('2023-06-01'),
        beanType: 'Ethiopia Yirgacheffe',
        profileId: profile.id,
        equipmentId: equipment.id,
        equipment: equipment.name, // Added this line
        notes: 'First crack at 9 minutes, development time 2 minutes',
        userId: user.id,
        weight: 250,
      },
      {
        date: new Date('2023-06-15'),
        beanType: 'Colombia Huila',
        profileId: profile.id,
        equipmentId: equipment.id,
        equipment: equipment.name, // Added this line
        notes: 'Smooth roast, nice caramel notes',
        userId: user.id,
        weight: 300,
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

async function seedExperiments() {
  const user = await prisma.user.findUnique({
    where: { email: 'user@example.com' },
  });
  if (!user) throw new Error('User not found');

  await prisma.experiment.createMany({
    data: [
      {
        name: 'Varying Roast Profiles',
        description: 'Testing different roast profiles on the same bean',
        startDate: new Date('2023-07-01'),
        endDate: new Date('2023-08-01'),
        status: 'In Progress',
        notes: 'Comparing light, medium, and dark roasts',
      },
      {
        name: 'Processing Methods Comparison',
        description: 'Comparing washed vs natural processed beans',
        startDate: new Date('2023-08-15'),
        endDate: null,
        status: 'Planned',
        notes: 'Using beans from the same farm with different processing',
      },
    ],
    skipDuplicates: true,
  });

  // Link some roast logs to experiments
  const experiments = await prisma.experiment.findMany();
  const roastLogs = await prisma.roastLog.findMany({ take: 2 });

  if (experiments[0] && roastLogs[0]) {
    await prisma.roastLog.update({
      where: { id: roastLogs[0].id },
      data: { experimentId: experiments[0].id },
    });
  }

  if (experiments[0] && roastLogs.length > 1 && roastLogs[1]) {
    await prisma.roastLog.update({
      where: { id: roastLogs[1].id },
      data: { experimentId: experiments[0].id },
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
