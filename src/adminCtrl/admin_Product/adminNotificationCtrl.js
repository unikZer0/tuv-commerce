const conn = require('../../setting/connection');
const { notificationQueries } = require('../../controller/product/query/notificationQuery');
const { sucMessage, errMessage } = require('../../service/messages');
const { logActivity, ACTIVITY_TYPES } = require('../../service/activityLogger');

// Create notification for a specific user
const createNotificationForUser = async (req, res) => {
    try {
        const { User_ID, Title, Message, Type, Related_ID, Related_Type } = req.body;

        // Validate required fields
        if (!User_ID || !Title || !Message) {
            return res.status(400).json({ error: 'User_ID, Title, and Message are required' });
        }

        // Validate notification type
        const validTypes = ['order', 'product', 'system', 'promotion'];
        if (Type && !validTypes.includes(Type)) {
            return res.status(400).json({ error: 'Invalid notification type' });
        }

        // Check if user exists
        const [userCheck] = await conn.query('SELECT User_ID FROM users WHERE User_ID = ?', [User_ID]);
        if (userCheck.length === 0) {
            return res.status(404).json({ error: 'User not found' });
        }

        const [result] = await conn.query(notificationQueries.createNotification, [
            User_ID, Title, Message, Type || 'system', Related_ID || null, Related_Type || null
        ]);

        // Log activity
        if (req.user && req.user.userId) {
            await logActivity({
                userId: req.user.userId,
                activityType: "NOTIFICATION_CREATE",
                description: `Admin created notification for user ${User_ID}`,
                relatedId: User_ID,
                ipAddress: req.ip || req.headers['x-forwarded-for'] || req.connection.remoteAddress,
                userAgent: req.headers['user-agent'] || null
            });
        }

        res.status(201).json({
            message: 'Notification created successfully',
            data: { Notification_ID: result.insertId }
        });
    } catch (error) {
        console.error('Error creating notification:', error);
        res.status(500).json({ error: 'Failed to create notification' });
    }
};

// Create notification for all users (broadcast)
const createNotificationForAllUsers = async (req, res) => {
    try {
        const { Title, Message, Type, Related_ID, Related_Type } = req.body;

        // Validate required fields
        if (!Title || !Message) {
            return res.status(400).json({ error: 'Title and Message are required' });
        }

        // Validate notification type
        const validTypes = ['order', 'product', 'system', 'promotion'];
        if (Type && !validTypes.includes(Type)) {
            return res.status(400).json({ error: 'Invalid notification type' });
        }

        const [result] = await conn.query(notificationQueries.createNotificationForAllUsers, [
            Title, Message, Type || 'system', Related_ID || null, Related_Type || null
        ]);

        // Log activity
        if (req.user && req.user.userId) {
            await logActivity({
                userId: req.user.userId,
                activityType: "NOTIFICATION_BROADCAST",
                description: `Admin broadcasted notification to all users`,
                relatedId: req.user.userId,
                ipAddress: req.ip || req.headers['x-forwarded-for'] || req.connection.remoteAddress,
                userAgent: req.headers['user-agent'] || null
            });
        }

        res.status(201).json({
            message: 'Notification broadcasted successfully',
            affectedRows: result.affectedRows
        });
    } catch (error) {
        console.error('Error broadcasting notification:', error);
        res.status(500).json({ error: 'Failed to broadcast notification' });
    }
};

// Get all notifications (admin view)
const getAllNotifications = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 20;
        const offset = (page - 1) * limit;
        const { userId, type, status } = req.query;

        let whereClause = '1=1';
        let params = [];

        if (userId) {
            whereClause += ' AND User_ID = ?';
            params.push(userId);
        }

        if (type) {
            whereClause += ' AND Type = ?';
            params.push(type);
        }

        if (status) {
            whereClause += ' AND Status = ?';
            params.push(status);
        }

        const [notifications] = await conn.query(
            `SELECT n.*, u.FirstName, u.LastName, u.Email, u.Role_id 
             FROM notifications n 
             LEFT JOIN users u ON n.User_ID = u.User_ID 
             WHERE ${whereClause} 
             ORDER BY n.Created_At DESC 
             LIMIT ? OFFSET ?`,
            [...params, limit, offset]
        );

        // Get total count
        const [countResult] = await conn.query(
            `SELECT COUNT(*) as total FROM notifications WHERE ${whereClause}`,
            params
        );

        const totalNotifications = countResult[0].total;
        const totalPages = Math.ceil(totalNotifications / limit);

        // Log activity
        if (req.user && req.user.userId) {
            await logActivity({
                userId: req.user.userId,
                activityType: "NOTIFICATION_VIEW_ALL",
                description: `Admin viewed all notifications`,
                relatedId: req.user.userId,
                ipAddress: req.ip || req.headers['x-forwarded-for'] || req.connection.remoteAddress,
                userAgent: req.headers['user-agent'] || null
            });
        }

        res.status(200).json({
            message: 'All notifications retrieved successfully',
            data: notifications,
            pagination: {
                currentPage: page,
                totalPages: totalPages,
                totalNotifications: totalNotifications,
                hasNextPage: page < totalPages,
                hasPrevPage: page > 1
            }
        });
    } catch (error) {
        console.error('Error getting all notifications:', error);
        res.status(500).json({ error: 'Failed to get all notifications' });
    }
};

// Get notifications for a specific user (admin view)
const getUserNotificationsAdmin = async (req, res) => {
    try {
        const { userId } = req.params;
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const offset = (page - 1) * limit;

        // Check if user exists
        const [userCheck] = await conn.query('SELECT User_ID, FirstName, LastName FROM users WHERE User_ID = ?', [userId]);
        if (userCheck.length === 0) {
            return res.status(404).json({ error: 'User not found' });
        }

        const [notifications] = await conn.query(
            `SELECT * FROM notifications 
             WHERE User_ID = ? 
             ORDER BY Created_At DESC 
             LIMIT ? OFFSET ?`,
            [userId, limit, offset]
        );

        // Get total count
        const [countResult] = await conn.query(
            'SELECT COUNT(*) as total FROM notifications WHERE User_ID = ?',
            [userId]
        );

        const totalNotifications = countResult[0].total;
        const totalPages = Math.ceil(totalNotifications / limit);

        res.status(200).json({
            message: `Notifications for user ${userCheck[0].FirstName} ${userCheck[0].LastName} retrieved successfully`,
            user: userCheck[0],
            data: notifications,
            pagination: {
                currentPage: page,
                totalPages: totalPages,
                totalNotifications: totalNotifications,
                hasNextPage: page < totalPages,
                hasPrevPage: page > 1
            }
        });
    } catch (error) {
        console.error('Error getting user notifications:', error);
        res.status(500).json({ error: 'Failed to get user notifications' });
    }
};

// Delete notification (admin)
const deleteNotificationAdmin = async (req, res) => {
    try {
        const { notificationId } = req.params;

        // Check if notification exists
        const [notificationCheck] = await conn.query(
            'SELECT * FROM notifications WHERE Notification_ID = ?',
            [notificationId]
        );

        if (notificationCheck.length === 0) {
            return res.status(404).json({ error: 'Notification not found' });
        }

        const [result] = await conn.query(
            'DELETE FROM notifications WHERE Notification_ID = ?',
            [notificationId]
        );

        // Log activity
        if (req.user && req.user.userId) {
            await logActivity({
                userId: req.user.userId,
                activityType: "NOTIFICATION_DELETE_ADMIN",
                description: `Admin deleted notification ${notificationId}`,
                relatedId: notificationId,
                ipAddress: req.ip || req.headers['x-forwarded-for'] || req.connection.remoteAddress,
                userAgent: req.headers['user-agent'] || null
            });
        }

        res.status(200).json({
            message: 'Notification deleted successfully'
        });
    } catch (error) {
        console.error('Error deleting notification:', error);
        res.status(500).json({ error: 'Failed to delete notification' });
    }
};

// Get notification statistics
const getNotificationStats = async (req, res) => {
    try {
        // Get total notifications
        const [totalResult] = await conn.query('SELECT COUNT(*) as total FROM notifications');
        
        // Get unread notifications
        const [unreadResult] = await conn.query("SELECT COUNT(*) as unread FROM notifications WHERE Status = 'unread'");
        
        // Get notifications by type
        const [typeResult] = await conn.query(`
            SELECT Type, COUNT(*) as count 
            FROM notifications 
            GROUP BY Type
        `);
        
        // Get notifications by status
        const [statusResult] = await conn.query(`
            SELECT Status, COUNT(*) as count 
            FROM notifications 
            GROUP BY Status
        `);
        
        // Get recent notifications (last 7 days)
        const [recentResult] = await conn.query(`
            SELECT COUNT(*) as recent 
            FROM notifications 
            WHERE Created_At >= DATE_SUB(NOW(), INTERVAL 7 DAY)
        `);

        res.status(200).json({
            message: 'Notification statistics retrieved successfully',
            data: {
                total: totalResult[0].total,
                unread: unreadResult[0].unread,
                byType: typeResult,
                byStatus: statusResult,
                recent7Days: recentResult[0].recent
            }
        });
    } catch (error) {
        console.error('Error getting notification statistics:', error);
        res.status(500).json({ error: 'Failed to get notification statistics' });
    }
};

// Mark notification as read (admin override)
const markNotificationAsReadAdmin = async (req, res) => {
    try {
        const { notificationId } = req.params;

        const [result] = await conn.query(
            "UPDATE notifications SET Status = 'read', Read_At = NOW() WHERE Notification_ID = ?",
            [notificationId]
        );

        if (result.affectedRows === 0) {
            return res.status(404).json({ error: 'Notification not found' });
        }

        // Log activity
        if (req.user && req.user.userId) {
            await logActivity({
                userId: req.user.userId,
                activityType: "NOTIFICATION_READ_ADMIN",
                description: `Admin marked notification ${notificationId} as read`,
                relatedId: notificationId,
                ipAddress: req.ip || req.headers['x-forwarded-for'] || req.connection.remoteAddress,
                userAgent: req.headers['user-agent'] || null
            });
        }

        res.status(200).json({
            message: 'Notification marked as read successfully'
        });
    } catch (error) {
        console.error('Error marking notification as read:', error);
        res.status(500).json({ error: 'Failed to mark notification as read' });
    }
};

module.exports = {
    createNotificationForUser,
    createNotificationForAllUsers,
    getAllNotifications,
    getUserNotificationsAdmin,
    deleteNotificationAdmin,
    getNotificationStats,
    markNotificationAsReadAdmin
}; 
