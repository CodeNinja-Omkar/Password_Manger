const express = require('express');
const prisma = require('../prismaClient');
const { encryptPassword, decryptPassword } = require('../utils/encryption');
const authenticateToken = require('../middleware/authMiddleware');

const router = express.Router();

// Apply authentication middleware to all routes in this file
router.use(authenticateToken);

// GET all passwords for the logged-in user
router.get('/', async (req, res) => {
  try {
    const userId = req.user.userId;

    const passwords = await prisma.passwordEntry.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' }
    });

    // Decrypt passwords before sending them to the client
    const decryptedPasswords = passwords.map(entry => ({
      ...entry,
      password: decryptPassword(entry.encryptedPassword),
      encryptedPassword: undefined // remove encrypted field from response
    }));

    res.json(decryptedPasswords);
  } catch (error) {
    console.error('Fetch passwords error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// POST a new password entry
router.post('/', async (req, res) => {
  try {
    const { site, username, password } = req.body;
    const userId = req.user.userId;

    if (!site || !username || !password) {
      return res.status(400).json({ error: 'Site, username, and password are required' });
    }

    // Encrypt the plain text password
    const encryptedPassword = encryptPassword(password);

    const newEntry = await prisma.passwordEntry.create({
      data: {
        userId,
        site,
        username,
        encryptedPassword
      }
    });

    res.status(201).json({ message: 'Password saved successfully', entryId: newEntry.id });
  } catch (error) {
    console.error('Save password error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// DELETE a password entry
router.delete('/:id', async (req, res) => {
  try {
    const entryId = parseInt(req.params.id, 10);
    const userId = req.user.userId;

    // Verify ownership before deleting
    const entry = await prisma.passwordEntry.findUnique({ where: { id: entryId } });
    
    if (!entry) {
      return res.status(404).json({ error: 'Password entry not found' });
    }

    if (entry.userId !== userId) {
      return res.status(403).json({ error: 'Unauthorized to delete this entry' });
    }

    await prisma.passwordEntry.delete({ where: { id: entryId } });

    res.json({ message: 'Password deleted successfully' });
  } catch (error) {
    console.error('Delete password error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;
