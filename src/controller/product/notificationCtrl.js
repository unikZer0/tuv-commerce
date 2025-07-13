const conn = require('../../setting/connection');
const { notificationQueries } = require('./query/notificationQuery');
const { sucMessage, errMessage } = require('../../service/messages');
const { logActivity, ACTIVITY_TYPES } = require('../../service/activityLogger');

// Get all notifications for the current user
const getUserNotifications = async (req, res) => {
    try {
        const User_ID = req.user.userId;
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const offset = (page - 1) * limit;

        const [notifications] = await conn.query(
            notificationQueries.getNotificationsWithPagination, 
            [User_ID, limit, offset]
        );

        // Get total count for pagination
        const [countResult] = await conn.query(
            'SELECT COUNT(*) as total FROM notifications WHERE User_ID = ?',
            [User_ID]
        );

        const totalNotifications = countResult[0].total;
        const totalPages = Math.ceil(totalNotifications / limit);

        // Log activity
        if (req.user && req.user.userId) {
            await logActivity({
                userId: req.user.userId,
                activityType: "NOTIFICATION_VIEW",
                description: `User viewed notifications`,
                relatedId: User_ID,
                ipAddress: req.ip || req.headers['x-forwarded-for'] || req.connection.remoteAddress,
                userAgent: req.headers['user-agent'] || null
            });
        }

        res.status(200).json({
            message: 'Notifications retrieved successfully',
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
        res.status(500).json({ error: 'Failed to get notifications' });
    }
};

// Get unread notifications count
const getUnreadCount = async (req, res) => {
    try {
        const User_ID = req.user.userId;
        const [result] = await conn.query(notificationQueries.getNotificationCount, [User_ID]);
        
        res.status(200).json({
            message: 'Unread count retrieved successfully',
            count: result[0].count
        });
    } catch (error) {
        console.error('Error getting unread count:', error);
        res.status(500).json({ error: 'Failed to get unread count' });
    }
};

// Get unread notifications
const getUnreadNotifications = async (req, res) => {
    try {
        const User_ID = req.user.userId;
        const [notifications] = await conn.query(notificationQueries.getUnreadNotifications, [User_ID]);
        
        res.status(200).json({
            message: 'Unread notifications retrieved successfully',
            data: notifications
        });
    } catch (error) {
        console.error('Error getting unread notifications:', error);
        res.status(500).json({ error: 'Failed to get unread notifications' });
    }
};

// Mark notification as read
const markAsRead = async (req, res) => {
    try {
        const User_ID = req.user.userId;
        const { notificationId } = req.params;

        const [result] = await conn.query(notificationQueries.markAsRead, [notificationId, User_ID]);
        
        if (result.affectedRows === 0) {
            return res.status(404).json({ error: 'Notification not found or already read' });
        }

        // Log activity
        if (req.user && req.user.userId) {
            await logActivity({
                userId: req.user.userId,
                activityType: "NOTIFICATION_READ",
                description: `User marked notification as read`,
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

// Mark all notifications as read
const markAllAsRead = async (req, res) => {
    try {
        const User_ID = req.user.userId;
        const [result] = await conn.query(notificationQueries.markAllAsRead, [User_ID]);
        
        // Log activity
        if (req.user && req.user.userId) {
            await logActivity({
                userId: req.user.userId,
                activityType: "NOTIFICATION_READ_ALL",
                description: `User marked all notifications as read`,
                relatedId: User_ID,
                ipAddress: req.ip || req.headers['x-forwarded-for'] || req.connection.remoteAddress,
                userAgent: req.headers['user-agent'] || null
            });
        }

        res.status(200).json({
            message: 'All notifications marked as read successfully',
            affectedRows: result.affectedRows
        });
    } catch (error) {
        console.error('Error marking all notifications as read:', error);
        res.status(500).json({ error: 'Failed to mark all notifications as read' });
    }
};

// Delete a notification
const deleteNotification = async (req, res) => {
    try {
        const User_ID = req.user.userId;
        const { notificationId } = req.params;

        const [result] = await conn.query(notificationQueries.deleteNotification, [notificationId, User_ID]);
        
        if (result.affectedRows === 0) {
            return res.status(404).json({ error: 'Notification not found' });
        }

        // Log activity
        if (req.user && req.user.userId) {
            await logActivity({
                userId: req.user.userId,
                activityType: "NOTIFICATION_DELETE",
                description: `User deleted notification`,
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

// Get notifications by type
const getNotificationsByType = async (req, res) => {
    try {
        const User_ID = req.user.userId;
        const { type } = req.params;
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const offset = (page - 1) * limit;

        // Validate notification type
        const validTypes = ['order', 'product', 'system', 'promotion'];
        if (!validTypes.includes(type)) {
            return res.status(400).json({ error: 'Invalid notification type' });
        }

        const [notifications] = await conn.query(
            `SELECT * FROM notifications 
             WHERE User_ID = ? AND Type = ? 
             ORDER BY Created_At DESC 
             LIMIT ? OFFSET ?`,
            [User_ID, type, limit, offset]
        );

        // Get total count for this type
        const [countResult] = await conn.query(
            'SELECT COUNT(*) as total FROM notifications WHERE User_ID = ? AND Type = ?',
            [User_ID, type]
        );

        const totalNotifications = countResult[0].total;
        const totalPages = Math.ceil(totalNotifications / limit);

        res.status(200).json({
            message: `${type} notifications retrieved successfully`,
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
        console.error('Error getting notifications by type:', error);
        res.status(500).json({ error: 'Failed to get notifications by type' });
    }
};

module.exports = {
    getUserNotifications,
    getUnreadCount,
    getUnreadNotifications,
    markAsRead,
    markAllAsRead,
    deleteNotification,
    getNotificationsByType
}; 
