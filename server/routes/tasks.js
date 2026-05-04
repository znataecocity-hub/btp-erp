const express = require('express');
const router = express.Router();
const prisma = require('../prismaClient');

// GET all tasks (Global)
router.get('/', async (req, res) => {
  try {
    const tasks = await prisma.task.findMany({
      include: { project: true },
      orderBy: { startDate: 'desc' }
    });
    res.json(tasks);
  } catch (error) {
    console.error("Error fetching tasks:", error);
    res.status(500).json({ error: "Failed to fetch tasks" });
  }
});

// GET all tasks for a specific project
router.get('/project/:projectId', async (req, res) => {
  try {
    const tasks = await prisma.task.findMany({
      where: { projectId: req.params.projectId },
      orderBy: { startDate: 'asc' }
    });
    res.json(tasks);
  } catch (error) {
    console.error("Error fetching tasks:", error);
    res.status(500).json({ error: "Failed to fetch tasks" });
  }
});

// POST create a new task
router.post('/', async (req, res) => {
  try {
    const { name, projectId, startDate, endDate } = req.body;
    
    if (!name || !projectId || !startDate) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    const task = await prisma.task.create({
      data: {
        name,
        projectId,
        startDate: new Date(startDate),
        endDate: endDate ? new Date(endDate) : null,
        progress: 0
      }
    });
    res.status(201).json(task);
  } catch (error) {
    console.error("Error creating task:", error);
    res.status(500).json({ error: "Failed to create task" });
  }
});

// PUT update task progress
router.put('/:id', async (req, res) => {
  try {
    const { progress } = req.body;
    const task = await prisma.task.update({
      where: { id: req.params.id },
      data: { progress: parseFloat(progress) }
    });

    // Optional: Auto-calculate project progress based on average task progress
    const projectTasks = await prisma.task.findMany({
      where: { projectId: task.projectId }
    });
    
    const totalProgress = projectTasks.reduce((acc, t) => acc + t.progress, 0);
    const avgProgress = totalProgress / projectTasks.length;

    await prisma.project.update({
      where: { id: task.projectId },
      data: { progress: Math.round(avgProgress) }
    });

    res.json(task);
  } catch (error) {
    console.error("Error updating task progress:", error);
    res.status(500).json({ error: "Failed to update task progress" });
  }
});

module.exports = router;
