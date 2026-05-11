const express = require('express');
const router = express.Router();
const prisma = require('../prismaClient');

// GET all projects
router.get('/', async (req, res) => {
  try {
    const { companyId } = req.query;
    
    const projects = await prisma.project.findMany({
      where: companyId ? { companyId } : {},
      orderBy: { startDate: 'desc' }
    });
    res.json(projects);
  } catch (error) {
    console.error("Error fetching projects:", error);
    res.status(500).json({ error: "Failed to fetch projects" });
  }
});

// GET single project by ID
router.get('/:id', async (req, res) => {
  try {
    const project = await prisma.project.findUnique({
      where: { id: req.params.id },
      include: { tasks: true, expenses: true }
    });
    if (!project) return res.status(404).json({ error: "Project not found" });

    // Calculate Financial KPIs
    const totalExpenses = project.expenses.reduce((sum, exp) => sum + exp.amount, 0);
    const profit = project.budget - totalExpenses;
    const profitMargin = project.budget > 0 ? (profit / project.budget) * 100 : 0;

    res.json({
      ...project,
      totalExpenses,
      profit,
      profitMargin
    });
  } catch (error) {
    console.error("Error fetching project:", error);
    res.status(500).json({ error: "Failed to fetch project" });
  }
});

// POST create new project
router.post('/', async (req, res) => {
  try {
    const { name, location, type, budget, startDate, endDate, companyId } = req.body;
    
    // Validate required fields
    if (!name || !type || !budget || !startDate || !companyId) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    const project = await prisma.project.create({
      data: {
        name,
        location,
        type,
        budget: parseFloat(budget),
        startDate: new Date(startDate).toISOString(),
        endDate: endDate ? new Date(endDate).toISOString() : null,
        companyId
      }
    });
    res.status(201).json(project);
  } catch (error) {
    console.error("Error creating project:", error);
    res.status(500).json({ error: "Failed to create project" });
  }
});

// PUT update project progress
router.put('/:id/progress', async (req, res) => {
  try {
    const { progress } = req.body;
    const project = await prisma.project.update({
      where: { id: req.params.id },
      data: { progress: parseFloat(progress) }
    });
    res.json(project);
  } catch (error) {
    console.error("Error updating progress:", error);
    res.status(500).json({ error: "Failed to update progress" });
  }
});

module.exports = router;
