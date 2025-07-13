const conn = require('../setting/connection');
const { notificationQueries } = require('../controller/product/query/notificationQuery');

class NotificationService {
    // Create notification for a single user
    static async createNotification(userId, title, message, type = 'system', relatedId = null, relatedType = null) {
        try {
            const [result] = await conn.query(notificationQueries.createNotification, [
                userId, title, message, type, relatedId, relatedType
            ]);
            return { success: true, notificationId: result.insertId };
        } catch (error) {
            console.error('Error creating notification:', error);
            return { success: false, error: error.message };
        }
    }

    // Create notification for multiple users
    static async createNotificationForUsers(userIds, title, message, type = 'system', relatedId = null, relatedType = null) {
        try {
            const results = [];
            for (const userId of userIds) {
                const result = await this.createNotification(userId, title, message, type, relatedId, relatedType);
                results.push(result);
            }
            return results;
        } catch (error) {
            console.error('Error creating notifications for multiple users:', error);
            return { success: false, error: error.message };
        }
    }

    // Create notification for all users (except admins)
    static async createNotificationForAllUsers(title, message, type = 'system', relatedId = null, relatedType = null) {
        try {
            const [result] = await conn.query(notificationQueries.createNotificationForAllUsers, [
                title, message, type, relatedId, relatedType
            ]);
            return { success: true, affectedRows: result.affectedRows };
        } catch (error) {
            console.error('Error creating notification for all users:', error);
            return { success: false, error: error.message };
        }
    }

    // Order-related notifications
    static async notifyOrderStatusChange(userId, orderId, status, orderNumber) {
        const statusMessages = {
            'pending': 'Your order is being processed',
            'confirmed': 'Your order has been confirmed',
            'shipped': 'Your order has been shipped',
            'delivered': 'Your order has been delivered',
            'cancelled': 'Your order has been cancelled',
            'refunded': 'Your order has been refunded'
        };

        const title = `Order Status Update - ${orderNumber}`;
        const message = statusMessages[status] || `Your order status has been updated to: ${status}`;

        return await this.createNotification(userId, title, message, 'order', orderId, 'order');
    }

    static async notifyOrderCreated(userId, orderId, orderNumber, totalAmount) {
        const title = `Order Confirmed - ${orderNumber}`;
        const message = `Your order has been successfully placed. Total amount: ${totalAmount} KIP`;

        return await this.createNotification(userId, title, message, 'order', orderId, 'order');
    }

    static async notifyOrderCancelled(userId, orderId, orderNumber, reason = '') {
        const title = `Order Cancelled - ${orderNumber}`;
        const message = `Your order has been cancelled.${reason ? ` Reason: ${reason}` : ''}`;

        return await this.createNotification(userId, title, message, 'order', orderId, 'order');
    }

    // Product-related notifications
    static async notifyProductBackInStock(userId, productId, productName) {
        const title = 'Product Back in Stock';
        const message = `${productName} is now back in stock!`;

        return await this.createNotification(userId, title, message, 'product', productId, 'product');
    }

    static async notifyProductPriceDrop(userId, productId, productName, oldPrice, newPrice) {
        const title = 'Price Drop Alert';
        const message = `${productName} price has dropped from ${oldPrice} to ${newPrice} KIP!`;

        return await this.createNotification(userId, title, message, 'product', productId, 'product');
    }

    static async notifyNewProduct(userId, productId, productName) {
        const title = 'New Product Available';
        const message = `Check out our new product: ${productName}`;

        return await this.createNotification(userId, title, message, 'product', productId, 'product');
    }

    // Promotion-related notifications
    static async notifyPromotion(userId, promotionTitle, promotionMessage, promotionId = null) {
        return await this.createNotification(userId, promotionTitle, promotionMessage, 'promotion', promotionId, 'promotion');
    }

    static async notifyPromotionForAllUsers(promotionTitle, promotionMessage, promotionId = null) {
        return await this.createNotificationForAllUsers(promotionTitle, promotionMessage, 'promotion', promotionId, 'promotion');
    }

    // System notifications
    static async notifySystemMaintenance(userId, maintenanceMessage, scheduledTime = null) {
        const title = 'System Maintenance Notice';
        const message = scheduledTime 
            ? `Scheduled maintenance on ${scheduledTime}. ${maintenanceMessage}`
            : maintenanceMessage;

        return await this.createNotification(userId, title, message, 'system');
    }

    static async notifySystemMaintenanceForAllUsers(maintenanceMessage, scheduledTime = null) {
        const title = 'System Maintenance Notice';
        const message = scheduledTime 
            ? `Scheduled maintenance on ${scheduledTime}. ${maintenanceMessage}`
            : maintenanceMessage;

        return await this.createNotificationForAllUsers(title, message, 'system');
    }

    // Account-related notifications
    static async notifyPasswordChanged(userId) {
        const title = 'Password Changed';
        const message = 'Your password has been successfully changed. If this was not you, please contact support immediately.';

        return await this.createNotification(userId, title, message, 'system');
    }

    static async notifyAccountLocked(userId, reason = '') {
        const title = 'Account Locked';
        const message = `Your account has been locked for security reasons.${reason ? ` Reason: ${reason}` : ''} Please contact support for assistance.`;

        return await this.createNotification(userId, title, message, 'system');
    }

    static async notifyAccountUnlocked(userId) {
        const title = 'Account Unlocked';
        const message = 'Your account has been unlocked. You can now log in normally.';

        return await this.createNotification(userId, title, message, 'system');
    }

    // Review-related notifications
    static async notifyReviewPosted(userId, productId, productName) {
        const title = 'Review Posted';
        const message = `Your review for ${productName} has been posted successfully.`;

        return await this.createNotification(userId, title, message, 'product', productId, 'product');
    }

    static async notifyReviewReplied(userId, productId, productName) {
        const title = 'Review Reply';
        const message = `You received a reply to your review for ${productName}.`;

        return await this.createNotification(userId, title, message, 'product', productId, 'product');
    }

    // Wishlist-related notifications
    static async notifyWishlistItemBackInStock(userId, productId, productName) {
        const title = 'Wishlist Item Back in Stock';
        const message = `${productName} from your wishlist is now back in stock!`;

        return await this.createNotification(userId, title, message, 'product', productId, 'product');
    }

    // Bulk operations
    static async notifyWishlistUsersForProduct(productId, productName, action = 'back_in_stock') {
        try {
            // Get all users who have this product in their wishlist
            const [wishlistUsers] = await conn.query(
                'SELECT DISTINCT User_ID FROM wishlist WHERE Product_ID = ?',
                [productId]
            );

            const userIds = wishlistUsers.map(user => user.User_ID);
            
            if (action === 'back_in_stock') {
                // Create notifications for each user in the wishlist
                const results = [];
                for (const userId of userIds) {
                    const result = await this.notifyProductBackInStock(userId, productId, productName);
                    results.push(result);
                }
                return { success: true, notifiedUsers: userIds.length, results };
            } else if (action === 'price_drop') {
                // This would need price information passed as parameters
                return await this.createNotificationForUsers(userIds, 'Price Drop Alert', `${productName} price has dropped!`, 'product', productId, 'product');
            }

            return { success: true, notifiedUsers: userIds.length };
        } catch (error) {
            console.error('Error notifying wishlist users:', error);
            return { success: false, error: error.message };
        }
    }

    // Get notification statistics for a user
    static async getUserNotificationStats(userId) {
        try {
            const [totalResult] = await conn.query(
                'SELECT COUNT(*) as total FROM notifications WHERE User_ID = ?',
                [userId]
            );
            
            const [unreadResult] = await conn.query(
                "SELECT COUNT(*) as unread FROM notifications WHERE User_ID = ? AND Status = 'unread'",
                [userId]
            );

            const [typeResult] = await conn.query(
                'SELECT Type, COUNT(*) as count FROM notifications WHERE User_ID = ? GROUP BY Type',
                [userId]
            );

            return {
                total: totalResult[0].total,
                unread: unreadResult[0].unread,
                byType: typeResult
            };
        } catch (error) {
            console.error('Error getting user notification stats:', error);
            return null;
        }
    }
}

module.exports = NotificationService; 
