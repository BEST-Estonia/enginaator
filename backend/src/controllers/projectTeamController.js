const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// Get all project members
exports.getProjectMembers = async (req, res) => {
  try {
    const members = await prisma.projectMember.findMany();
    res.json(members);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch project members' });
  }
};

// Create a new project member
exports.createProjectMember = async (req, res) => {
  try {
    const { name, role, phone, email, description } = req.body;
    const imageUrl = req.file ? req.file.path : '';
    const member = await prisma.projectMember.create({
      data: { name, role, phone, email, description, imageUrl }
    });
    res.status(201).json(member);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create project member' });
  }
};

// Update a project member
exports.updateProjectMember = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, role, phone, email, description } = req.body;
    let imageUrl = req.body.imageUrl;
    if (req.file) {
      imageUrl = req.file.path;
    }
    const member = await prisma.projectMember.update({
      where: { id },
      data: { name, role, phone, email, description, imageUrl }
    });
    res.json(member);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update project member' });
  }
};

// Delete a project member
exports.deleteProjectMember = async (req, res) => {
  try {
    const { id } = req.params;
    await prisma.projectMember.delete({ where: { id } });
    res.json({ message: 'Project member deleted' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete project member' });
  }
};