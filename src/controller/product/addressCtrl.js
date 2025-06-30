const { sucMessage, errMessage } = require("../../service/messages");
const { addressQueries, orderQuery } = require("./query/orderPageQuery");
const { v4: uuidv4 } = require("uuid");
const conn = require('../../setting/connection')
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
  try {
    const User_ID = req.user.userId;
    const { Village, District, Province, Transportation, Branch } = req.body;

  if (!Village || !District || !Province) {
    res.status(400).json({ message: errMessage.insert });
  }
 const [rows] = await conn.query(
      `SELECT COUNT(*) AS count FROM address WHERE User_ID = ?`, 
      [User_ID]
    );

    const addressCount = rows[0].count;

    if (addressCount >= 5) {
      return res.status(400).json({ message: "You can only have maximum 5 addresses." });
    }
  const rawUuid = uuidv4()
  const AID = (await "AID") + rawUuid.replace(/-/g, "").slice(0, 10);
  const [result] = await conn.query(addressQueries.insert, [
    AID,
    User_ID,
    Village,
    District,
    Province,
    Transportation,
    Branch,
  ]);

  res.status(201).json({ message: sucMessage.insert, data: result });
  } catch (error) {
    console.log(error);
    res.status(500).json({message:error})
  }
};
const editAddressCtrl = async (req,res)=>{
  const Address_ID = req.params.id;
  const {Village,District,Province,Transportation,Branch}= req.body
  const [result] = await conn.query(addressQueries.edit,[Village,District,Province,Transportation,Branch,Address_ID])
  res.status(200).json({message:"address updated successfully"})
}
module.exports ={
    insertAddressCtrl,
    showAddressCtrl,
    editAddressCtrl
}
