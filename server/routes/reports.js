const express = require('express');
const router = express.Router();
const prisma = require('../prismaClient');

// GET global project summary report
router.get('/summary', async (req, res) => {
  try {
    const projects = await prisma.project.findMany({
      include: {
        _count: { select: { tasks: true, expenses: true } },
        expenses: { select: { amount: true } }
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
        efficiency: p.budget > 0 ? (totalSpent / p.budget) * 100 : 0
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
    const expenses = await prisma.expense.findMany({
      select: { amount: true, date: true }
    });

    // Simple grouping by month
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

module.exports = router;
