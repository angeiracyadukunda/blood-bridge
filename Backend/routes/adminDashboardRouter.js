const express = require('express');
const { getDashboardData } = require('../controllers/adminDashboardController');

const router = express.Router();

router.get('/admin/dashboard', getDashboardData);

module.exports = router;
