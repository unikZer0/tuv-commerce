const conn = require("../../setting/connection")
const {activitiesQueries} = require('./query/activitiesQuery')
const { sucMessage, errMessage } = require('../../service/messages');
const activitiesCtrl = async (req,res) => {
    
    try {
        // const page = parseInt(req.query.page) || 1
        // const limit = parseInt(req.query.limit) || 10
        const [activities] = await conn.query(activitiesQueries.showActivities)
        const results = activities
        res.json({message:sucMessage.sucMessage,data:results})
    } catch (error) {
        res.status(400).json({message:errMessage.server})
        console.log(error);
    }
}

module.exports = {
    activitiesCtrl
}
