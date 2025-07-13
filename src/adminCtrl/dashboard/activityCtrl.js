const conn = require("../../setting/connection")
const {activitiesQueries} = require('./query/activitiesQuery')
const { sucMessage, errMessage } = require('../../service/messages');

const activitiesCtrl = async (req,res) => {
    
    try {
        const [activities] = await conn.query(activitiesQueries.showActivities)
        const results = activities
        res.json({message:sucMessage.sucMessage,data:results})
    } catch (error) {
        res.status(400).json({message:errMessage.server})
        console.log(error);
    }
}

const allActivitiesCtrl = async (req,res) => {
    
    try {
        const page = parseInt(req.query.page) || 1
        const limit = parseInt(req.query.limit) || 20
        const offset = (page - 1) * limit
        const search = req.query.search || ''
        const type = req.query.type || ''
        const date = req.query.date || ''

        // Build WHERE clause for filtering
        let whereClause = '1=1'
        let params = []

        if (search) {
            whereClause += ' AND (a.Activity_Description LIKE ? OR a.Activity_Type LIKE ? OR r.Role_Name LIKE ?)'
            const searchParam = `%${search}%`
            params.push(searchParam, searchParam, searchParam)
        }

        if (type) {
            whereClause += ' AND a.Activity_Type LIKE ?'
            params.push(`%${type}%`)
        }

        if (date) {
            whereClause += ' AND DATE(a.Created_At) = ?'
            params.push(date)
        }

        // Get total count for pagination
        const [countResult] = await conn.query(
            `SELECT COUNT(*) as total FROM activities a 
             JOIN users u ON a.User_ID = u.User_ID 
             JOIN roles r ON u.Role_ID = r.Role_ID 
             WHERE ${whereClause}`,
            params
        )

        const total = countResult[0].total

        // Get activities with pagination and filtering
        const [activities] = await conn.query(
            `SELECT a.*, r.Role_Name
             FROM (
               SELECT * FROM activities
               ORDER BY Activity_ID DESC
             ) AS a
             JOIN users u ON a.User_ID = u.User_ID
             JOIN roles r ON u.Role_ID = r.Role_ID
             WHERE ${whereClause}
             ORDER BY a.Activity_ID DESC
             LIMIT ? OFFSET ?`,
            [...params, limit, offset]
        )

        const results = activities
        console.log(`Fetched ${results.length} activities out of ${total} total`);
        
        res.json({
            message: sucMessage.sucMessage,
            data: results,
            total: total,
            page: page,
            limit: limit,
            totalPages: Math.ceil(total / limit)
        })
    } catch (error) {
        console.error('Error fetching activities:', error);
        res.status(500).json({message: errMessage.server})
    }
}

module.exports = {
    activitiesCtrl,
    allActivitiesCtrl
}
