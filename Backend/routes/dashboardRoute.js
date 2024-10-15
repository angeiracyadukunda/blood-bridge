const express = require('express');
const router = express.Router();
const { isAuthenticated, renderDashboardView } = require('../controllers/dashboadController');

// Routes for Receiver Dashboard
router.get('/:uid/dashboard', isAuthenticated('recipient'), renderDashboardView('recipient', 'dashboard/maindashboard', 'Admin Dashboard'));
router.get('/:uid/dashboard/managedonationcenters', isAuthenticated('recipient'), renderDashboardView('recipient', 'dashboard/managedonationcenters', 'Manage Donation Centers'));
router.get('/:uid/dashboard/manage-appointments', isAuthenticated('recipient'), renderDashboardView('recipient', 'dashboard/manage-appointments', 'Manage Appointments'));
router.get('/:uid/dashboard/dashboard-overview', isAuthenticated('recipient'), renderDashboardView('recipient', 'dashboard/dashboard-overview', 'Dashboard Overview'));
router.get('/:uid/dashboard/manage-donors', isAuthenticated('recipient'), renderDashboardView('recipient', 'dashboard/manage-donors', 'Manage Blood donation'));
router.get('/:uid/dashboard/post-announcements', isAuthenticated('recipient'), renderDashboardView('recipient', 'dashboard/post-announcements', 'Post Announcements'));
router.get('/:uid/dashboard/manageschedules', isAuthenticated('recipient'), renderDashboardView('recipient', 'dashboard/manageschedules', 'Manage Schedules'));

// Routes for Donor Dashboard
router.get('/:uid/donorsdashboard', isAuthenticated('donor'), renderDashboardView('donor', 'donorsdashboard/donor', 'Dashboard'));
router.get('/:uid/donorsdashboard/overview', isAuthenticated('donor'), renderDashboardView('donor', 'donorsdashboard/overview', 'Dashboard Overview'));
router.get('/:uid/donorsdashboard/appointments', isAuthenticated('donor'), renderDashboardView('donor', 'donorsdashboard/appointments', 'All Appointments'));
router.get('/:uid/donorsdashboard/donor-card', isAuthenticated('donor'), renderDashboardView('donor', 'donorsdashboard/donor-card', 'My Donor Card'));
router.get('/:uid/donorsdashboard/drives', isAuthenticated('donor'), renderDashboardView('donor', 'donorsdashboard/drives', 'Blood Donation Drives'));
router.get('/:uid/donorsdashboard/guidelines', isAuthenticated('donor'), renderDashboardView('donor', 'donorsdashboard/guidelines', 'Guidlines'));
router.get('/:uid/donorsdashboard/health-screening', isAuthenticated('donor'), renderDashboardView('donor', 'donorsdashboard/health-screening', 'Healt Screening'));
router.get('/:uid/donorsdashboard/when-to-donate', isAuthenticated('donor'), renderDashboardView('donor', 'donorsdashboard/when-to-donate', 'When to Donate'));
router.get('/:uid/donorsdashboard/profile', isAuthenticated('donor'), renderDashboardView('donor', 'donorsdashboard/profile', 'My Profile'));

module.exports = router;
