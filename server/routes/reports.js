const express = require('express');
const router = express.Router();
const prisma = require('../prismaClient');

// GET global project summary report
router.get('/summary', async (req, res) => {
  try {
    const { companyId } = req.query;
    const projects = await prisma.project.findMany({
      where: companyId ? { companyId } : {},
      include: {
        expenses: { select: { amount: true, category: true } }
      }
    });

    const report = projects.map(p => {
      const totalSpent = p.expenses.reduce((acc, e) => acc + e.amount, 0);
      return {
        id: p.id,
        name: p.name,
        progress: p.progress,
        budget: p.budget,
        spent: totalSpent,
        efficiency: p.budget > 0 ? (totalSpent / p.budget) * 100 : 0,
        expenseBreakdown: p.expenses.reduce((acc, e) => {
          acc[e.category] = (acc[e.category] || 0) + e.amount;
          return acc;
        }, {})
      };
    });

    res.json(report);
  } catch (error) {
    console.error("Error generating summary report:", error);
    res.status(500).json({ error: "Failed to generate report" });
  }
});

// GET financial overview (monthly expenses)
router.get('/financial', async (req, res) => {
  try {
    const { companyId } = req.query;
    const expenses = await prisma.expense.findMany({
      where: companyId ? { project: { companyId } } : {},
      select: { amount: true, date: true },
      orderBy: { date: 'asc' }
    });

    const monthly = expenses.reduce((acc, exp) => {
      const month = new Date(exp.date).toLocaleString('default', { month: 'short' });
      acc[month] = (acc[month] || 0) + exp.amount;
      return acc;
    }, {});

    res.json(monthly);
  } catch (error) {
    console.error("Error generating financial report:", error);
    res.status(500).json({ error: "Failed to generate financial report" });
  }
});

// GET equipment utilization
router.get('/equipment-stats', async (req, res) => {
  try {
    const { companyId } = req.query;
    const equipment = await prisma.equipment.findMany({
      where: companyId ? { companyId } : {},
      include: { _count: { select: { usages: true } } }
    });

    const stats = equipment.map(e => ({
      name: e.name,
      status: e.status,
      usageCount: e._count.usages
    }));

    res.json(stats);
  } catch (error) {
    console.error("Error fetching equipment stats:", error);
    res.status(500).json({ error: "Failed to fetch equipment stats" });
  }
});

module.exports = router;

