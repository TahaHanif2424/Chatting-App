import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

const avatars = [
  { name: 'Animated boy', avatarURL: 'https://api.dicebear.com/7.x/avataaars/svg?seed=boy' },
  { name: 'Animated girl', avatarURL: 'https://api.dicebear.com/7.x/avataaars/svg?seed=girl' },
  { name: 'Young man', avatarURL: 'https://api.dicebear.com/7.x/avataaars/svg?seed=youngman' },
  { name: 'Young woman', avatarURL: 'https://api.dicebear.com/7.x/avataaars/svg?seed=youngwoman' },
  { name: 'Old man', avatarURL: 'https://api.dicebear.com/7.x/avataaars/svg?seed=oldman' },
  { name: 'Old woman', avatarURL: 'https://api.dicebear.com/7.x/avataaars/svg?seed=oldwoman' },
  { name: 'Cute kid girl', avatarURL: 'https://api.dicebear.com/7.x/avataaars/svg?seed=kidgirl' },
  { name: 'Teen boy', avatarURL: 'https://api.dicebear.com/7.x/avataaars/svg?seed=teenboy' },
  { name: 'Teen girl', avatarURL: 'https://api.dicebear.com/7.x/avataaars/svg?seed=teengirl' },
  { name: 'Man with beard', avatarURL: 'https://api.dicebear.com/7.x/avataaars/svg?seed=beardman' },
  { name: 'Business woman', avatarURL: 'https://api.dicebear.com/7.x/avataaars/svg?seed=bizwoman' },
  { name: 'Artist (female)', avatarURL: 'https://api.dicebear.com/7.x/avataaars/svg?seed=artistf' },
  { name: 'Artist (male)', avatarURL: 'https://api.dicebear.com/7.x/avataaars/svg?seed=artistm' },
  { name: 'Casual man', avatarURL: 'https://api.dicebear.com/7.x/avataaars/svg?seed=casualman' },
  { name: 'Casual woman', avatarURL: 'https://api.dicebear.com/7.x/avataaars/svg?seed=casualwoman' },
];

async function seedAvatars() {
  try {
    await prisma.avatar.deleteMany(); // optional: clear old entries
    await prisma.avatar.createMany({
      data: avatars,
    });
  } catch (err) {
    console.error('❌ Failed to seed avatars:', err);
  } finally {
    await prisma.$disconnect();
  }
}

seedAvatars();
