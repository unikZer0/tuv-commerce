const notificationQueries = {
    // Create a new notification
    createNotification: `
        INSERT INTO notifications (User_ID, Title, Message, Type, Related_ID, Related_Type) 
        VALUES (?, ?, ?, ?, ?, ?)
    `,
    
    // Get all notifications for a user
    getUserNotifications: `
        SELECT * FROM notifications 
        WHERE User_ID = ? 
        ORDER BY Created_At DESC
    `,
    
    // Get unread notifications for a user
    getUnreadNotifications: `
        SELECT * FROM notifications 
        WHERE User_ID = ? AND Status = 'unread' 
        ORDER BY Created_At DESC
    `,
    
    // Get notifications by type
    getNotificationsByType: `
        SELECT * FROM notifications 
        WHERE User_ID = ? AND Type = ? 
        ORDER BY Created_At DESC
    `,
    
    // Mark notification as read
    markAsRead: `
        UPDATE notifications 
        SET Status = 'read', Read_At = NOW() 
        WHERE Notification_ID = ? AND User_ID = ?
    `,
    
    // Mark all notifications as read for a user
    markAllAsRead: `
        UPDATE notifications 
        SET Status = 'read', Read_At = NOW() 
        WHERE User_ID = ? AND Status = 'unread'
    `,
    
    // Delete a notification
    deleteNotification: `
        DELETE FROM notifications 
        WHERE Notification_ID = ? AND User_ID = ?
    `,
    
    // Get notification count for a user
    getNotificationCount: `
        SELECT COUNT(*) as count FROM notifications 
        WHERE User_ID = ? AND Status = 'unread'
    `,
    
    // Get notifications with pagination
    getNotificationsWithPagination: `
        SELECT * FROM notifications 
        WHERE User_ID = ? 
        ORDER BY Created_At DESC 
        LIMIT ? OFFSET ?
    `,
    
    // Create notification for all users (admin broadcast) - excluding admin users (Role_id = 1)
    createNotificationForAllUsers: `
        INSERT INTO notifications (User_ID, Title, Message, Type, Related_ID, Related_Type)
        SELECT User_ID, ?, ?, ?, ?, ? FROM users WHERE Role_id != 1
    `,
    
    // Get notifications by related ID and type
    getNotificationsByRelated: `
        SELECT * FROM notifications 
        WHERE Related_ID = ? AND Related_Type = ? 
        ORDER BY Created_At DESC
    `,
    
    // Get all users except admins for broadcasting
    getNonAdminUsers: `
        SELECT User_ID FROM users WHERE Role_id != 1
    `,
    
    // Get user details for admin view
    getUserDetails: `
        SELECT User_ID, FirstName, LastName, Email, Role_id FROM users WHERE User_ID = ?
    `,
    
    // Get all notifications with user details for admin view
    getAllNotificationsWithUserDetails: `
        SELECT n.*, u.FirstName, u.LastName, u.Email, u.Role_id 
        FROM notifications n 
        LEFT JOIN users u ON n.User_ID = u.User_ID 
        WHERE 1=1
    `,
    
    // Get notification statistics
    getNotificationStats: `
        SELECT 
            COUNT(*) as total,
            SUM(CASE WHEN Status = 'unread' THEN 1 ELSE 0 END) as unread,
            SUM(CASE WHEN Status = 'read' THEN 1 ELSE 0 END) as read,
            Type,
            COUNT(*) as count_by_type
        FROM notifications 
        GROUP BY Type
    `,
    
    // Get recent notifications count (last 7 days)
    getRecentNotificationsCount: `
        SELECT COUNT(*) as recent 
        FROM notifications 
        WHERE Created_At >= DATE_SUB(NOW(), INTERVAL 7 DAY)
    `
};

module.exports = { notificationQueries }; 
