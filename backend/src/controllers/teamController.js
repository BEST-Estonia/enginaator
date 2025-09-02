const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

//First function is to register a new team
const registerTeam = async (req, res) => {
    try {
        const {teamName, field, leaderName, leaderEmail, leaderPhone, members} = req.body;

        //Save team to database
        const team = await prisma.team.create({
            data: {
                teamName,
                field,
                leaderName,
                leaderEmail,
                leaderPhone,
                members: {
                    create: members.map(member => ({
                        name: member.name,
                        age: parseInt(member.age),
                        email: member.email
                    }))
                }
            },
            include: {
                members: true
            }
        });

        res.status(201).json({
            success: true,
            message: 'Team registered successfully!',
            team
        });
    } catch (error) {
        console.error('Error registering team:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to register team',
            error: error.message
        });
    }
};

// Function 2: Get all teams
const getAllTeams = async (req, res) => {
    try {
        const teams = await prisma.team.findMany({
            include: {
                members: true
            },
            orderBy: {
                createdAt: 'desc'
            }
        });

        res.json({
            success: true,
            count: teams.length,
            teams
        });

    } catch (error) {
        console.error('Error getting teams:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to get teams',
            error: error.message
        });
    }
};

//Function 3: Get team statistics
const getTeamStats = async (req, res) => {
    try {
        const totalTeams = await prisma.team.count();
        const totalMembers = await prisma.teamMember.count();

        const teamsByField = await prisma.team.groupBy({
            by: ['field'],
            _count: {
                field: true
            }
        });

        res.json({
            success: true,
            stats: {
                totalTeams,
                totalMembers,
                averageMembersPerTeam: totalTeams > 0 ? (totalMembers / totalTeams).toFixed(2) : 0,
                teamsByField
            }
        });
    } catch (error) {
        console.error('Error getting stats:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to get statistics',
            error: error.message
        });
    }
};

module.exports = {
    registerTeam,
    getAllTeams,
    getTeamStats
};
