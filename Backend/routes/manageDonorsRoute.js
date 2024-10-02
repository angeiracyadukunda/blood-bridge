const express = require('express');
const { getDonors, getDonorDetails } = require('../controllers/manageDonorsController');
const router = express.Router();

router.get('/manage-donors', getDonors);
router.get('/donor-details/:uid', getDonorDetails);

module.exports = router;