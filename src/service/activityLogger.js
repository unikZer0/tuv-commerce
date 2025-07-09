const conn = require('../setting/connection');

// Activity types constants
const ACTIVITY_TYPES = {
    // Authentication activities
    LOGIN: 'LOGIN',
    LOGOUT: 'LOGOUT',
    REGISTER: 'REGISTER',
    PASSWORD_CHANGE: 'PASSWORD_CHANGE',
    
    // User profile activities
    PROFILE_UPDATE: 'PROFILE_UPDATE',
    PROFILE_VIEW: 'PROFILE_VIEW',
    
    // Product activities
    PRODUCT_VIEW: 'PRODUCT_VIEW',
    PRODUCT_SEARCH: 'PRODUCT_SEARCH',
    PRODUCT_CREATE: 'PRODUCT_CREATE',
    PRODUCT_UPDATE: 'PRODUCT_UPDATE',
    PRODUCT_DELETE: 'PRODUCT_DELETE',
    
    // Order activities
    ORDER_CREATE: 'ORDER_CREATE',
    ORDER_UPDATE: 'ORDER_UPDATE',
    ORDER_CANCEL: 'ORDER_CANCEL',
    ORDER_VIEW: 'ORDER_VIEW',
    
    // Wishlist activities
    WISHLIST_ADD: 'WISHLIST_ADD',
    WISHLIST_REMOVE: 'WISHLIST_REMOVE',
    WISHLIST_VIEW: 'WISHLIST_VIEW',
    
    // Admin activities
    USER_CREATE: 'USER_CREATE',
    USER_UPDATE: 'USER_UPDATE',
    USER_DELETE: 'USER_DELETE',
    USER_VIEW: 'USER_VIEW',
    
    // Dashboard activities
    DASHBOARD_VIEW: 'DASHBOARD_VIEW',
    STATISTICS_VIEW: 'STATISTICS_VIEW',
    REPORTS_VIEW: 'REPORTS_VIEW',
    
    // System activities
    SYSTEM_LOGIN: 'SYSTEM_LOGIN',
    SYSTEM_LOGOUT: 'SYSTEM_LOGOUT',
    ERROR_OCCURRED: 'ERROR_OCCURRED'
};

/**
 * Log an activity to the database
 * @param {Object} activityData - Activity data object
 * @param {number} activityData.userId - User ID performing the action
 * @param {string} activityData.activityType - Type of activity (use ACTIVITY_TYPES constants)
 * @param {string} activityData.description - Description of the activity
 * @param {number} activityData.relatedId - Related entity ID (optional)
 * @param {string} activityData.ipAddress - IP address of the user
 * @param {string} activityData.userAgent - User agent string
 * @returns {Promise<Object>} - Result of the logging operation
 */
const logActivity = async (activityData) => {
    try {
        const {
            userId,
            activityType,
            description,
            relatedId = null,
            ipAddress = null,
            userAgent = null
        } = activityData;

        // Validate required fields
        if (!userId || !activityType || !description) {
            throw new Error('Missing required fields: userId, activityType, description');
        }

        // Validate activity type
        if (!Object.values(ACTIVITY_TYPES).includes(activityType)) {
            throw new Error(`Invalid activity type: ${activityType}`);
        }

        const query = `
            INSERT INTO activities 
            (User_ID, Activity_Type, Activity_Description, Related_ID, IP_Address, User_Agent, Created_At)
            VALUES (?, ?, ?, ?, ?, ?, NOW())
        `;

        const [result] = await conn.query(query, [
            userId,
            activityType,
            description,
            relatedId,
            ipAddress,
            userAgent
        ]);

        return {
            success: true,
            activityId: result.insertId,
            message: 'Activity logged successfully'
        };

    } catch (error) {
        console.error('Error logging activity:', error);
        return {
            success: false,
            error: error.message
        };
    }
};

/**
 * Get activities for a specific user
 * @param {number} userId - User ID
 * @param {number} limit - Number of records to return (default: 50)
 * @param {number} offset - Number of records to skip (default: 0)
 * @returns {Promise<Array>} - Array of activities
 */
const getUserActivities = async (userId, limit = 50, offset = 0) => {
    try {
        const query = `
            SELECT 
                a.*,
                u.FirstName,
                u.LastName,
                u.Email
            FROM activities a
            JOIN users u ON a.User_ID = u.User_ID
            WHERE a.User_ID = ?
            ORDER BY a.Created_At DESC
            LIMIT ? OFFSET ?
        `;

        const [results] = await conn.query(query, [userId, limit, offset]);
        return results;

    } catch (error) {
        console.error('Error getting user activities:', error);
        throw error;
    }
};

/**
 * Get all activities with optional filters
 * @param {Object} filters - Filter options
 * @param {string} filters.activityType - Filter by activity type
 * @param {number} filters.userId - Filter by user ID
 * @param {string} filters.dateFrom - Filter from date (YYYY-MM-DD)
 * @param {string} filters.dateTo - Filter to date (YYYY-MM-DD)
 * @param {number} filters.limit - Number of records to return (default: 100)
 * @param {number} filters.offset - Number of records to skip (default: 0)
 * @returns {Promise<Array>} - Array of activities
 */
const getAllActivities = async (filters = {}) => {
    try {
        let query = `
            SELECT 
                a.*,
                u.FirstName,
                u.LastName,
                u.Email,
                u.Role_id
            FROM activities a
            JOIN users u ON a.User_ID = u.User_ID
            WHERE 1=1
        `;

        const queryParams = [];

        // Apply filters
        if (filters.activityType) {
            query += ' AND a.Activity_Type = ?';
            queryParams.push(filters.activityType);
        }

        if (filters.userId) {
            query += ' AND a.User_ID = ?';
            queryParams.push(filters.userId);
        }

        if (filters.dateFrom) {
            query += ' AND DATE(a.Created_At) >= ?';
            queryParams.push(filters.dateFrom);
        }

        if (filters.dateTo) {
            query += ' AND DATE(a.Created_At) <= ?';
            queryParams.push(filters.dateTo);
        }

        query += ' ORDER BY a.Created_At DESC';
        query += ' LIMIT ? OFFSET ?';
        queryParams.push(filters.limit || 100, filters.offset || 0);

        const [results] = await conn.query(query, queryParams);
        return results;

    } catch (error) {
        console.error('Error getting all activities:', error);
        throw error;
    }
};

/**
 * Get activity statistics
 * @returns {Promise<Object>} - Activity statistics
 */
const getActivityStats = async () => {
    try {
        const queries = {
            totalActivities: 'SELECT COUNT(*) as total FROM activities',
            todayActivities: 'SELECT COUNT(*) as today FROM activities WHERE DATE(Created_At) = CURDATE()',
            activityTypes: `
                SELECT Activity_Type, COUNT(*) as count 
                FROM activities 
                GROUP BY Activity_Type 
                ORDER BY count DESC
            `,
            topUsers: `
                SELECT 
                    a.User_ID,
                    u.FirstName,
                    u.LastName,
                    u.Email,
                    COUNT(*) as activity_count
                FROM activities a
                JOIN users u ON a.User_ID = u.User_ID
                GROUP BY a.User_ID, u.FirstName, u.LastName, u.Email
                ORDER BY activity_count DESC
                LIMIT 10
            `
        };

        const [totalResult] = await conn.query(queries.totalActivities);
        const [todayResult] = await conn.query(queries.todayActivities);
        const [typesResult] = await conn.query(queries.activityTypes);
        const [usersResult] = await conn.query(queries.topUsers);

        return {
            total: totalResult[0].total,
            today: todayResult[0].today,
            activityTypes: typesResult,
            topUsers: usersResult
        };

    } catch (error) {
        console.error('Error getting activity stats:', error);
        throw error;
    }
};

module.exports = {
    ACTIVITY_TYPES,
    logActivity,
    getUserActivities,
    getAllActivities,
    getActivityStats
}; 
