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
  try {
    const Address_ID = req.params.id;
    const User_ID = req.user.userId;
    const {Village,District,Province,Transportation,Branch}= req.body
    
    // Verify that the address belongs to the user
    const [checkOwnership] = await conn.query(
      'SELECT User_ID FROM address WHERE Address_ID = ?', 
      [Address_ID]
    );
    
    if (checkOwnership.length === 0) {
      return res.status(404).json({message: "Address not found"});
    }
    
    if (checkOwnership[0].User_ID !== User_ID) {
      return res.status(403).json({message: "You don't have permission to edit this address"});
    }
    
    const [result] = await conn.query(addressQueries.edit,[Village,District,Province,Transportation,Branch,Address_ID])
    res.status(200).json({message:"Address updated successfully", data: result})
  } catch (error) {
    console.log(error);
    res.status(500).json({message: errMessage.server})
  }
}

const deleteAddressCtrl = async (req, res) => {
  try {
    const Address_ID = req.params.id;
    const User_ID = req.user.userId;
    
    // Verify that the address belongs to the user
    const [checkOwnership] = await conn.query(
      'SELECT User_ID FROM address WHERE Address_ID = ?', 
      [Address_ID]
    );
    
    if (checkOwnership.length === 0) {
      return res.status(404).json({message: "Address not found"});
    }
    
    if (checkOwnership[0].User_ID !== User_ID) {
      return res.status(403).json({message: "You don't have permission to delete this address"});
    }
    
    // Check if this address is being used in any orders
    const [orderCheck] = await conn.query(
      'SELECT COUNT(*) as count FROM orders WHERE Address_ID = ?',
      [Address_ID]
    );
    
    if (orderCheck[0].count > 0) {
      return res.status(400).json({
        message: "Cannot delete address. It is being used in existing orders."
      });
    }
    
    // Delete the address
    const [result] = await conn.query(
      'DELETE FROM address WHERE Address_ID = ?',
      [Address_ID]
    );
    
    if (result.affectedRows === 0) {
      return res.status(404).json({message: "Address not found"});
    }
    
    res.status(200).json({
      message: "Address deleted successfully",
      data: result
    });
    
  } catch (error) {
    console.log(error);
    res.status(500).json({message: errMessage.server});
  }
}

module.exports ={
    insertAddressCtrl,
    showAddressCtrl,
    editAddressCtrl,
    deleteAddressCtrl
}
