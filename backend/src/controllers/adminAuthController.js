const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { prisma } = require('../utils/prisma');

const JWT_SECRET = process.env.JWT_SECRET || 'dev_secret';
const ADMIN_COOKIE_NAME = 'adminToken';

function getCookieOptions() {
  return {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 24 * 60 * 60 * 1000,
    path: '/',
  };
}

exports.login = async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) return res.status(400).json({ error: 'Missing credentials' });
  const user = await prisma.adminUser.findUnique({ where: { email } });
  if (!user) return res.status(401).json({ error: 'Invalid credentials' });
  const valid = await bcrypt.compare(password, user.passwordHash);
  if (!valid) return res.status(401).json({ error: 'Invalid credentials' });
  const token = jwt.sign({ id: user.id, email: user.email, role: user.role }, JWT_SECRET, { expiresIn: '1d' });
  res.cookie(ADMIN_COOKIE_NAME, token, getCookieOptions());
  res.json({ success: true });
};

exports.logout = async (_req, res) => {
  res.clearCookie(ADMIN_COOKIE_NAME, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
  });

  return res.json({ success: true });
};

exports.changePassword = async (req, res) => {
  const adminId = req.adminUser?.id;
  const { currentPassword, newPassword } = req.body || {};

  if (!adminId) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  if (!currentPassword || !newPassword) {
    return res.status(400).json({ error: 'Current password and new password are required' });
  }

  if (String(newPassword).length < 10) {
    return res.status(400).json({ error: 'New password must be at least 10 characters' });
  }

  const user = await prisma.adminUser.findUnique({ where: { id: adminId } });
  if (!user) {
    return res.status(404).json({ error: 'Admin user not found' });
  }

  const currentMatches = await bcrypt.compare(currentPassword, user.passwordHash);
  if (!currentMatches) {
    return res.status(401).json({ error: 'Current password is incorrect' });
  }

  const sameAsCurrent = await bcrypt.compare(newPassword, user.passwordHash);
  if (sameAsCurrent) {
    return res.status(400).json({ error: 'New password must be different from current password' });
  }

  const passwordHash = await bcrypt.hash(newPassword, 12);
  await prisma.adminUser.update({
    where: { id: adminId },
    data: { passwordHash },
  });

  return res.json({ success: true, message: 'Password updated successfully' });
};
