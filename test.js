const { PrismaClient } = require('./src/generated/prisma'); 
const prisma = new PrismaClient(); 
prisma.user.create({ data: { id: 'test1', name: 'test', email: 'test@test.com', role: 'PENDING' } })
  .then(console.log)
  .catch(console.error)
  .finally(() => prisma.$disconnect());
