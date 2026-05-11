const express = require('express');
const router = express.Router();
const prisma = require('../prismaClient');

// GET all expenses
router.get('/', async (req, res) => {
  try {
    const { companyId } = req.query;
    const expenses = await prisma.expense.findMany({
      where: companyId ? { project: { companyId } } : {},
      include: { project: true },
      orderBy: { date: 'desc' }
    });
    res.json(expenses);
  } catch (error) {
    console.error("Error fetching expenses:", error);
    res.status(500).json({ error: "Failed to fetch expenses" });
  }
});

// POST create a new expense
router.post('/', async (req, res) => {
  try {
    const { amount, category, date, projectId, description } = req.body;
    
    if (!amount || !category || !date || !projectId) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    const expense = await prisma.expense.create({
      data: {
        amount: parseFloat(amount),
        category,
        date: new Date(date).toISOString(),
        projectId
      }
    });
    res.status(201).json(expense);
  } catch (error) {
    console.error("Error creating expense:", error);
    res.status(500).json({ error: "Failed to create expense" });
  }
});

// GET expense stats (Total per category, Total per project)
router.get('/stats', async (req, res) => {
  try {
    const { companyId } = req.query;
    const where = companyId ? { project: { companyId } } : {};

    const totalExpenses = await prisma.expense.aggregate({
      where,
      _sum: { amount: true }
    });

    const byCategory = await prisma.expense.groupBy({
      by: ['category'],
      where,
      _sum: { amount: true }
    });

    res.json({
      total: totalExpenses._sum.amount || 0,
      byCategory
    });
  } catch (error) {
    console.error("Error fetching expense stats:", error);
    res.status(500).json({ error: "Failed to fetch stats" });
  }
});

module.exports = router;
