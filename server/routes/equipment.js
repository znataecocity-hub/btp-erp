const express = require('express');
const router = express.Router();
const prisma = require('../prismaClient');

// GET all equipment
router.get('/', async (req, res) => {
  try {
    const { companyId } = req.query;
    const equipment = await prisma.equipment.findMany({
      where: companyId ? { companyId } : {},
      orderBy: { name: 'asc' }
    });
    res.json(equipment);
  } catch (error) {
    console.error("Error fetching equipment:", error);
    res.status(500).json({ error: "Failed to fetch equipment" });
  }
});

// POST create new equipment
router.post('/', async (req, res) => {
  try {
    const { name, type, status, dailyCost, companyId } = req.body;
    const equipment = await prisma.equipment.create({
      data: {
        name,
        type,
        status,
        dailyCost: parseFloat(dailyCost),
        companyId
      }
    });
    res.status(201).json(equipment);
  } catch (error) {
    console.error("Error creating equipment:", error);
    res.status(500).json({ error: "Failed to create equipment" });
  }
});

// POST log equipment usage
router.post('/usage', async (req, res) => {
  try {
    const { equipmentId, projectId, startDate, endDate } = req.body;
    const usage = await prisma.equipmentUsage.create({
      data: {
        equipmentId,
        projectId,
        startDate: new Date(startDate).toISOString(),
        endDate: endDate ? new Date(endDate).toISOString() : null
      }
    });
    res.status(201).json(usage);
  } catch (error) {
    console.error("Error logging equipment usage:", error);
    res.status(500).json({ error: "Failed to log equipment usage" });
  }
});

module.exports = router;
