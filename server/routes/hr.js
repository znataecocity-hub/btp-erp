const express = require('express');
const router = express.Router();
const prisma = require('../prismaClient');

// GET all employees
router.get('/employees', async (req, res) => {
  try {
    const { companyId } = req.query;
    const employees = await prisma.employee.findMany({
      where: companyId ? { companyId } : {},
      orderBy: { lastName: 'asc' }
    });
    res.json(employees);
  } catch (error) {
    console.error("Error fetching employees:", error);
    res.status(500).json({ error: "Failed to fetch employees" });
  }
});

// POST create new employee
router.post('/employees', async (req, res) => {
  try {
    const { firstName, lastName, role, specialty, salaryType, rate, companyId } = req.body;
    const employee = await prisma.employee.create({
      data: {
        firstName,
        lastName,
        role,
        specialty,
        salaryType,
        rate: parseFloat(rate),
        companyId
      }
    });
    res.status(201).json(employee);
  } catch (error) {
    console.error("Error creating employee:", error);
    res.status(500).json({ error: "Failed to create employee" });
  }
});

// POST log attendance (Pointage)
router.post('/attendance', async (req, res) => {
  try {
    const { employeeId, date, status } = req.body;
    const attendance = await prisma.attendance.create({
      data: {
        employeeId,
        date: new Date(date).toISOString(),
        status
      }
    });
    res.status(201).json(attendance);
  } catch (error) {
    console.error("Error logging attendance:", error);
    res.status(500).json({ error: "Failed to log attendance" });
  }
});

module.exports = router;
