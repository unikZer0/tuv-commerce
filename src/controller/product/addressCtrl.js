const { sucMessage, errMessage } = require("../../service/messages");
const { addressQueries } = require("./query/orderPageQuery");
const showAddressCtrl = async (req, res) => {
  const User_ID = req.user.userId;
  const [result] = await conn.query(addressQueries.show, [User_ID]);
  if (result.length < 0) {
    return res.json({ message: "no data" });
  }
  res.status(200).json({ message: sucMessage.seeAll, data: result });
};
//address
const insertAddressCtrl = async (req, res) => {
  const User_ID = req.user.userId;
  const { Village, District, Province, Transportation, Branch } = req.body;

  if (!Village || !District || !Province) {
    res.status(400).json({ message: errMessage.insert });
  }
  const [result] = await conn.query(addressQueries.insert, [
    User_ID,
    Village,
    District,
    Province,
    Transportation,
    Branch,
  ]);

  res.status(201).json({ message: sucMessage.insert, data: result });
};
module.exports ={
    insertAddressCtrl,
    showAddressCtrl
}
