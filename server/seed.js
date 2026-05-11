const prisma = require('./prismaClient');

async function main() {
  // 1. Create Company
  const company = await prisma.company.upsert({
    where: { id: 'comp-1' },
    update: {},
    create: {
      id: 'comp-1',
      name: 'BTP Construction Maroc'
    }
  });

  // 2. Create Projects
  const p1 = await prisma.project.create({
    data: {
      name: 'Résidence Al Boraq',
      location: 'Casablanca',
      type: 'BATIMENT',
      budget: 15000000,
      startDate: new Date('2024-01-01'),
      progress: 65,
      companyId: company.id
    }
  });

  const p2 = await prisma.project.create({
    data: {
      name: 'Usine Renault Extension',
      location: 'Tanger',
      type: 'INDUSTRIEL',
      budget: 25000000,
      startDate: new Date('2024-03-15'),
      progress: 30,
      companyId: company.id
    }
  });

  const p3 = await prisma.project.create({
    data: {
      name: 'Barrage Oued Lau',
      location: 'Chefchaouen',
      type: 'HYDRAULIQUE',
      budget: 85000000,
      startDate: new Date('2023-11-20'),
      progress: 85,
      companyId: company.id
    }
  });

  // 3. Create Expenses
  const expenses = [
    { projectId: p1.id, amount: 2000000, category: 'MATERIAL', date: new Date('2024-02-10') },
    { projectId: p1.id, amount: 1500000, category: 'LABOR', date: new Date('2024-03-05') },
    { projectId: p1.id, amount: 500000, category: 'EQUIPMENT', date: new Date('2024-04-01') },
    
    { projectId: p2.id, amount: 5000000, category: 'MATERIAL', date: new Date('2024-04-15') },
    { projectId: p2.id, amount: 1000000, category: 'LABOR', date: new Date('2024-04-20') },
    
    { projectId: p3.id, amount: 40000000, category: 'MATERIAL', date: new Date('2024-01-20') },
    { projectId: p3.id, amount: 15000000, category: 'LABOR', date: new Date('2024-02-15') },
    { projectId: p3.id, amount: 12000000, category: 'EQUIPMENT', date: new Date('2024-03-10') }
  ];

  for (const exp of expenses) {
    await prisma.expense.create({ data: exp });
  }

  // 4. Create Employees
  const employees = [
    { firstName: 'Ahmed', lastName: 'Tazi', role: 'FOREMAN', specialty: 'Gros Œuvre', salaryType: 'MONTHLY', rate: 12000, companyId: company.id },
    { firstName: 'Yassine', lastName: 'Idrissi', role: 'WORKER', specialty: 'Maçonnerie', salaryType: 'DAILY', rate: 250, companyId: company.id },
    { firstName: 'Fatima', lastName: 'Zahra', role: 'MANAGER', specialty: 'Génie Civil', salaryType: 'MONTHLY', rate: 18000, companyId: company.id },
    { firstName: 'Omar', lastName: 'Bennani', role: 'WORKER', specialty: 'Électricité', salaryType: 'DAILY', rate: 300, companyId: company.id }
  ];

  for (const emp of employees) {
    await prisma.employee.create({ data: emp });
  }

  // 5. Create Equipment
  const equipment = [
    { name: 'Tractopelle CAT-01', type: 'TERRASSEMENT', status: 'IN_USE', dailyCost: 1500, companyId: company.id },
    { name: 'Grue à Tour G-45', type: 'LEVAGE', status: 'IN_USE', dailyCost: 5000, companyId: company.id },
    { name: 'Bétonnière B-12', type: 'MAÇONNERIE', status: 'AVAILABLE', dailyCost: 300, companyId: company.id },
    { name: 'Camion Benne M-05', type: 'TRANSPORT', status: 'BROKEN', dailyCost: 2000, companyId: company.id }
  ];

  for (const eq of equipment) {
    const createdEq = await prisma.equipment.create({ data: eq });
    // Assign some usage
    if (createdEq.status === 'IN_USE') {
      await prisma.equipmentUsage.create({
        data: {
          equipmentId: createdEq.id,
          projectId: p1.id,
          startDate: new Date('2024-04-01')
        }
      });
    }
  }

  console.log('Seed: Data populated successfully!');
}

main()
  .catch(e => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

