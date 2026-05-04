const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const prisma = require('../prismaClient');

const JWT_SECRET = process.env.JWT_SECRET || 'btp_secret_key_123';

// REGISTER
router.post('/register', async (req, res) => {
  try {
    const { email, password, name, companyName } = req.body;
    
    // Create company first
    const company = await prisma.company.create({
      data: { name: companyName }
    });

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        role: 'ADMIN',
        companyId: company.id
      }
    });

    const token = jwt.sign({ userId: user.id, companyId: company.id }, JWT_SECRET);
    res.json({ token, user: { email: user.email, role: user.role } });
  } catch (error) {
    console.error("Register error:", error);
    res.status(500).json({ error: "Failed to register" });
  }
});

// LOGIN
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await prisma.user.findUnique({ where: { email } });
    
    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    const token = jwt.sign({ userId: user.id, companyId: user.companyId }, JWT_SECRET);
    res.json({ token, user: { email: user.email, role: user.role, companyId: user.companyId } });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ error: "Failed to login" });
  }
});

module.exports = router;
