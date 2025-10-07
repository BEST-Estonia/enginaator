const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// Get all project members
exports.getProjectMembers = async (req, res) => {
  try {
    console.log('Attempting to fetch project members...');
    const members = await prisma.projectMember.findMany();
    console.log('Successfully fetched project members:', members);
    res.json(members);
  } catch (error) {
    console.error('Database error when fetching project members:', error);
    res.status(500).json({ 
      error: 'Failed to fetch project members', 
      details: error.message,
      stack: error.stack 
    });
  }
};

// Create a new project member
exports.createProjectMember = async (req, res) => {
  try {
    console.log('Creating project member with data:', req.body);
    console.log('File:', req.file);
    
    const { name, role, phone, email, description } = req.body;
    const imageUrl = req.file ? req.file.path : '';
    
    const member = await prisma.projectMember.create({
      data: { name, role, phone, email, description, imageUrl }
    });
    
    console.log('Successfully created project member:', member);
    res.status(201).json(member);
  } catch (error) {
    console.error('Error creating project member:', error);
    res.status(500).json({ 
      error: 'Failed to create project member', 
      details: error.message 
    });
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
    console.error('Error updating project member:', error);
    res.status(500).json({ 
      error: 'Failed to update project member', 
      details: error.message 
    });
  }
};

// Delete a project member
exports.deleteProjectMember = async (req, res) => {
  try {
    const { id } = req.params;
    await prisma.projectMember.delete({ where: { id } });
    res.json({ message: 'Project member deleted' });
  } catch (error) {
    console.error('Error deleting project member:', error);
    res.status(500).json({ 
      error: 'Failed to delete project member', 
      details: error.message 
    });
  }
};