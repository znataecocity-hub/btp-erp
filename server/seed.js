const prisma = require('./prismaClient');

async function main() {
  const company = await prisma.company.upsert({
    where: { id: 'comp-1' },
    update: {},
    create: {
      id: 'comp-1',
      name: 'BTP Construction Maroc'
    }
  });
  console.log('Seed: Created/Found Company:', company);
}

main()
  .catch(e => console.error(e))
  .finally(async () => await prisma.$disconnect());
