const conn = require('../../setting/connection');
const { userQueries } = require('./UserQueries');
const { sucMessage, errMessage } = require('../../service/messages');
const { logActivity, ACTIVITY_TYPES } = require('../../service/activityLogger');

const getAllUsersCtrl = async (req, res) => {
  try {
    const [results] = await conn.query(userQueries.getAllUsers);

    return res.status(200).json({
      message: sucMessage.seeAll,
      data: results,
    });

  } catch (error) {
    console.error("users error:", error);
    return res.status(500).json({ message: errMessage.server });
  }
};
const DeleteUsersCtrl = async (req, res) => {
  try {
    const User_ID = req.params.id
    const [results] = await conn.query(userQueries.deleteUsers,[User_ID]);

    // Log activity
    if (req.user && req.user.userId) {
      await logActivity({
        userId: req.user.userId,
        activityType: ACTIVITY_TYPES.USER_DELETE,
        description: `Deleted user with ID ${User_ID}`,
        relatedId: User_ID,
        ipAddress: req.ip || req.headers['x-forwarded-for'] || req.connection.remoteAddress,
        userAgent: req.headers['user-agent'] || null
      });
    }

    return res.status(200).json({
      message: sucMessage.seeAll,
      data: results,
    });

  } catch (error) {
    console.error("users error:", error);
    return res.status(500).json({ message: errMessage.server });
  }
};
const UpdateUsersCtrl = async (req, res) => {
  try {
    const User_ID = req.params.id
    const { FirstName, LastName, Email, Phone, Role_id, Sex } = req.body;
    const [results] = await conn.query(userQueries.updatedUsers,[FirstName,LastName,Email,Phone,Role_id,Sex,User_ID]);
    if (results.affectedRows === 0) {
      return res.status(404).json({ message: "User not found." });
    }
    return res.status(200).json({
      message: sucMessage.seeAll,
      data: results,
    });

  } catch (error) {
    console.error("users error:", error);
    return res.status(500).json({ message: errMessage.server });
  }
};

module.exports = { getAllUsersCtrl,DeleteUsersCtrl ,UpdateUsersCtrl};
