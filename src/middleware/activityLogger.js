const { logActivity, ACTIVITY_TYPES } = require('../service/activityLogger');

/**
 * Activity logger middleware
 * Usage: activityLogger(activityType, getDescription, getRelatedId)
 *
 * @param {string} activityType - One of ACTIVITY_TYPES
 * @param {function} getDescription - Function (req, res) => string
 * @param {function} [getRelatedId] - Function (req, res) => number|null
 */
function activityLogger(activityType, getDescription, getRelatedId) {
    return async (req, res, next) => {
        // Call after response is sent
        res.on('finish', async () => {
            try {
                // Only log if user is authenticated
                const user = req.user;
                if (!user || !user.userId) return;

                const description = getDescription(req, res);
                const relatedId = getRelatedId ? getRelatedId(req, res) : null;
                const ipAddress = req.ip || req.headers['x-forwarded-for'] || req.connection.remoteAddress;
                const userAgent = req.headers['user-agent'] || null;

                await logActivity({
                    userId: user.userId,
                    activityType,
                    description,
                    relatedId,
                    ipAddress,
                    userAgent
                });
            } catch (err) {
                console.error('Activity logger middleware error:', err);
            }
        });
        next();
    };
}

module.exports = { activityLogger, ACTIVITY_TYPES }; 
