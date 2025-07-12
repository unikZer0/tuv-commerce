const conn = require('../../setting/connection');
const { v4: uuidv4 } = require('uuid');

// Get all shipments with order details
const getAllShipments = async (req, res) => {
    try {
        const query = `
            SELECT 
                s.Shipment_ID,
                s.Tracking_Number,
                s.Ship_Status,
                s.Ship_Date,
                o.OID,
                o.Order_Date,
                o.Total_Amount,
                o.Order_Status,
                u.FirstName,
                u.LastName,
                u.Email,
                u.Phone,
                a.Village,
                a.District,
                a.Province
            FROM shipment s
            LEFT JOIN orders o ON s.Shipment_ID = o.Shipment_ID
            LEFT JOIN users u ON o.User_ID = u.User_ID
            LEFT JOIN address a ON o.Address_ID = a.Address_ID
            ORDER BY s.Ship_Date DESC
        `;
        
        const [shipments] = await conn.execute(query);
        
        res.json({
            success: true,
            data: shipments
        });
    } catch (error) {
        console.error('Error fetching shipments:', error);
        res.status(500).json({
            success: false,
            message: 'Internal server error'
        });
    }
};

// Get shipment by ID
const getShipmentById = async (req, res) => {
    try {
        const { shipmentId } = req.params;
        
        const query = `
            SELECT 
                s.Shipment_ID,
                s.Tracking_Number,
                s.Ship_Status,
                s.Ship_Date,
                o.OID,
                o.Order_Date,
                o.Total_Amount,
                o.Order_Status,
                u.FirstName,
                u.LastName,
                u.Email,
                u.Phone,
                a.Village,
                a.District,
                a.Province,
                a.Transportation,
                a.Branch
            FROM shipment s
            LEFT JOIN orders o ON s.Shipment_ID = o.Shipment_ID
            LEFT JOIN users u ON o.User_ID = u.User_ID
            LEFT JOIN address a ON o.Address_ID = a.Address_ID
            WHERE s.Shipment_ID = ?
        `;
        
        const [shipments] = await conn.execute(query, [shipmentId]);
        
        if (shipments.length === 0) {
            return res.status(404).json({
                success: false,
                message: 'Shipment not found'
            });
        }
        
        res.json({
            success: true,
            data: shipments[0]
        });
    } catch (error) {
        console.error('Error fetching shipment:', error);
        res.status(500).json({
            success: false,
            message: 'Internal server error'
        });
    }
};

// Update shipment status
const updateShipmentStatus = async (req, res) => {
    try {
        const { shipmentId } = req.params;
        const { status } = req.body;
        
        // Validate status
        const validStatuses = ['preparing', 'shipped', 'delivered', 'cancelled'];
        if (!validStatuses.includes(status)) {
            return res.status(400).json({
                success: false,
                message: 'Invalid status. Must be one of: preparing, shipped, delivered, cancelled'
            });
        }
        
        // Check if shipment exists and get current status
        const [existingShipment] = await conn.execute(
            'SELECT * FROM shipment WHERE Shipment_ID = ?',
            [shipmentId]
        );
        
        if (existingShipment.length === 0) {
            return res.status(404).json({
                success: false,
                message: 'Shipment not found'
            });
        }
        
        // Prevent status changes if shipment is already cancelled or delivered
        if (existingShipment[0].Ship_Status === 'cancelled') {
            return res.status(400).json({
                success: false,
                message: 'ไม่สามารถอัปเดตสถานะของสินค้าที่ถูกยกเลิกแล้ว'
            });
        }
        
        if (existingShipment[0].Ship_Status === 'delivered') {
            return res.status(400).json({
                success: false,
                message: 'ไม่สามารถอัปเดตสถานะของสินค้าที่จัดส่งสำเร็จแล้ว'
            });
        }
        
        // Validate status transitions
        const currentStatus = existingShipment[0].Ship_Status;
        const validTransitions = {
            'preparing': ['shipped', 'cancelled'],
            'shipped': ['delivered', 'cancelled']
        };
        
        if (!validTransitions[currentStatus] || !validTransitions[currentStatus].includes(status)) {
            const statusText = {
                'preparing': 'กำลังเตรียม',
                'shipped': 'จัดส่งแล้ว',
                'delivered': 'จัดส่งสำเร็จ',
                'cancelled': 'ยกเลิก'
            };
            return res.status(400).json({
                success: false,
                message: `ไม่สามารถเปลี่ยนสถานะจาก "${statusText[currentStatus]}" เป็น "${statusText[status]}" ได้`
            });
        }
        
        // Update shipment status
        const updateQuery = `
            UPDATE shipment 
            SET Ship_Status = ?, 
                Ship_Date = CASE 
                    WHEN ? = 'shipped' THEN NOW()
                    ELSE Ship_Date 
                END
            WHERE Shipment_ID = ?
        `;
        
        await conn.execute(updateQuery, [status, status, shipmentId]);
        
        // Update order status if shipment is cancelled
        if (status === 'cancelled') {
            await conn.execute(
                'UPDATE orders SET Order_Status = ? WHERE Shipment_ID = ?',
                ['cancelled', shipmentId]
            );
        }
        
        // Log activity (only if user exists)
        if (req.user && req.user.User_ID) {
            const activityQuery = `
                INSERT INTO activities (User_ID, Activity_Type, Activity_Description, Related_ID, IP_Address, User_Agent)
                VALUES (?, ?, ?, ?, ?, ?)
            `;
            
            await conn.execute(activityQuery, [
                req.user.User_ID,
                'shipment_status_update',
                `Shipment status updated to ${status}`,
                shipmentId,
                req.ip || null,
                req.get('User-Agent') || null
            ]);
        }
        
        res.json({
            success: true,
            message: 'Shipment status updated successfully'
        });
    } catch (error) {
        console.error('Error updating shipment status:', error);
        res.status(500).json({
            success: false,
            message: 'Internal server error'
        });
    }
};

// Create new shipment
const createShipment = async (req, res) => {
    try {
        const { orderId } = req.body;
        
        // Check if order exists and doesn't have shipment
        const [order] = await conn.execute(
            'SELECT * FROM orders WHERE Order_ID = ?',
            [orderId]
        );
        
        if (order.length === 0) {
            return res.status(404).json({
                success: false,
                message: 'Order not found'
            });
        }
        
        if (order[0].Shipment_ID) {
            return res.status(400).json({
                success: false,
                message: 'Order already has a shipment'
            });
        }
        
        // Generate tracking number
        const trackingNumber = uuidv4().substring(0, 8) + '-' + Math.random().toString(36).substring(2, 3);
        
        // Create shipment
        const [result] = await conn.execute(
            'INSERT INTO shipment (Tracking_Number, Ship_Status, Ship_Date) VALUES (?, ?, NOW())',
            [trackingNumber, 'preparing']
        );
        
        const shipmentId = result.insertId;
        
        // Update order with shipment ID
        await conn.execute(
            'UPDATE orders SET Shipment_ID = ? WHERE Order_ID = ?',
            [shipmentId, orderId]
        );
        
        // Log activity (only if user exists)
        if (req.user && req.user.User_ID) {
            const activityQuery = `
                INSERT INTO activities (User_ID, Activity_Type, Activity_Description, Related_ID, IP_Address, User_Agent)
                VALUES (?, ?, ?, ?, ?, ?)
            `;
            
            await conn.execute(activityQuery, [
                req.user.User_ID,
                'shipment_created',
                `New shipment created with tracking number: ${trackingNumber}`,
                shipmentId,
                req.ip || null,
                req.get('User-Agent') || null
            ]);
        }
        
        res.json({
            success: true,
            message: 'Shipment created successfully',
            data: {
                shipmentId,
                trackingNumber
            }
        });
    } catch (error) {
        console.error('Error creating shipment:', error);
        res.status(500).json({
            success: false,
            message: 'Internal server error'
        });
    }
};

// Get shipment statistics
const getShipmentStats = async (req, res) => {
    try {
        const query = `
            SELECT 
                Ship_Status,
                COUNT(*) as count
            FROM shipment 
            GROUP BY Ship_Status
        `;
        
        const [stats] = await conn.execute(query);
        
        // Calculate total
        const total = stats.reduce((sum, stat) => sum + stat.count, 0);
        
        // Format response
        const formattedStats = {
            total,
            preparing: 0,
            shipped: 0,
            delivered: 0,
            cancelled: 0
        };
        
        stats.forEach(stat => {
            formattedStats[stat.Ship_Status] = stat.count;
        });
        
        res.json({
            success: true,
            data: formattedStats
        });
    } catch (error) {
        console.error('Error fetching shipment stats:', error);
        res.status(500).json({
            success: false,
            message: 'Internal server error'
        });
    }
};

module.exports = {
    getAllShipments,
    getShipmentById,
    updateShipmentStatus,
    createShipment,
    getShipmentStats
}; 