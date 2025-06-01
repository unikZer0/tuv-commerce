const { wishListQueries } = require("./query/productQuery");
const insertWishlistCtrl = async (req, res) => {
  try {
    const Date_Added = new Date();
    const User_ID = req.user.userId;
    const { Product_ID } = req.body;

    const [results] = await conn.query(wishListQueries.insert, [
      User_ID,
      Product_ID,
      Date_Added,
    ]);
    if (!User_ID || !Product_ID) {
      return res
        .status(400)
        .json({ error: "User_ID and Product_ID are required" });
    }
    res.status(201).json({ message: "show product", data: results });
  } catch (error) {
    console.log(error);
    if (error.code === "ER_NO_REFERENCED_ROW_2") {
      return res.status(400).json({ error: "Invalid User_ID or Product_ID" });
    }
    res.status(500).json({ error: "Server Failed" });
  }
};
//delete
const deletetWishlistCtrl = async (req, res) => {
  try {
    const Product_ID = req.params.id;
    const [results] = await conn.query(wishListQueries.delete, [Product_ID]);
    const [showAll] = await conn.query(wishListQueries.showAll);
    res.status(201).json({ message: sucMessage.delete, data: showAll });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Server Failed" });
  }
};
//show each  user
const showWishlist = async (req, res) => {
  try {
    const User_ID = req.user.userId;
    const [results] = await conn.query(wishListQueries.showWishlist, [User_ID]);
    if (results.length === 0) {
      return res.status(404).json({ message: "No selected" });
    }
    res.status(200).json({ message: "show wishlist", data: results });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Server Failed" });
  }
};
module.exports = {insertWishlistCtrl,showWishlist,deletetWishlistCtrl}
