// controllers/pengurusController.js

const { programData, userData } = require('../models/staticData');

exports.showDashboard = (req, res) => {
    const publishedPrograms = programData.filter(p => p.isPublished === true);
    res.render('pengurus/dashboard', {
        title: 'Dashboard Pengurus',
        user: userData.pengurus,
        programs: publishedPrograms
    });
};