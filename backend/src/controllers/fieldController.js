const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

//Get all fields
exports.getFields = async (req, res) => {
    try {
        const fields = await prisma.field.findMany();
        res.json(fields);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch fields' });
    }
};

//Create a new field
exports.createField = async (req, res) => {
    try {
        const {name, description, icon} = req.body;
        const field = await prisma.field.create({
            data: {name, description, icon}
        });
        res.status(201).json(field);
    } catch (error) {
        res.status(500).json({ error: 'Failed to create field' });
    }
};

//Update a field
exports.updateField = async (req, res) => {
    try {
        const { id } = req.params;
        const { name, description, icon } = req.body;
        const field = await prisma.field.update({
            where: {id},
            data: {name, description, icon}
        });
        res.json(field);
    } catch (error) {
        res.status(500).json({ error: 'Failed to update field' });
    }
}

// Delete a field
exports.deleteField = async (req, res) => {
  try {
    const { id } = req.params;
    await prisma.field.delete({ where: { id } });
    res.json({ message: 'Field deleted' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete field' });
  }
};