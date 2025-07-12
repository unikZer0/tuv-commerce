const express = require('express');
const router = express.Router();
const shipmentCtrl = require('../../adminCtrl/admin_Sipment/shipmentCtrl');
const verifyToken = require('../../controller/tokenhandle/verifyToken');
const authorizeRole = require('../../middleware/authorizeRole');

// Get all shipments
router.get('/all', verifyToken, authorizeRole(1, 2), shipmentCtrl.getAllShipments);

// Get shipment by ID
router.get('/:shipmentId', verifyToken, authorizeRole(1, 2), shipmentCtrl.getShipmentById);

// Update shipment status
router.put('/:shipmentId/status', verifyToken, authorizeRole(1, 2), shipmentCtrl.updateShipmentStatus);

// Create new shipment
router.post('/create', verifyToken, authorizeRole(1, 2), shipmentCtrl.createShipment);

// Get shipment statistics
router.get('/stats/overview', verifyToken, authorizeRole(1, 2), shipmentCtrl.getShipmentStats);

module.exports = router; 