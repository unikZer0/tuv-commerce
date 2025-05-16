const conn = require('../../setting/connection');
const { userQueries } = require('./UserQueries');
const { sucMessage, errMessage } = require('../../service/messages');

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

module.exports = { getAllUsersCtrl };
