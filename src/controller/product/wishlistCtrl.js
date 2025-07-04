const { wishListQueries } = require("./query/productQuery");
const conn = require('../../setting/connection')

const insertWishlistCtrl = async (req, res) => {
  try {
    const Date_Added = new Date();
    const User_ID = req.user.userId;
    const { Product_ID } = req.body;

    // Validate required fields
    if (!User_ID || !Product_ID) {
      return res
        .status(400)
        .json({ error: "User_ID and Product_ID are required" });
    }

    const [results] = await conn.query(wishListQueries.insert, [
      User_ID,
      Product_ID,
      Date_Added,
    ]);
    
    res.status(201).json({ message: "Added to wishlist successfully", data: results });
  } catch (error) {
    console.log(error);
    if (error.code === "ER_NO_REFERENCED_ROW_2") {
      return res.status(400).json({ error: "Invalid User_ID or Product_ID" });
    }
    if (error.code === "ER_DUP_ENTRY") {
      return res.status(400).json({ error: "Item already in wishlist" });
    }
    res.status(500).json({ error: "Server Failed" });
  }
};

// Delete from wishlist
const deletetWishlistCtrl = async (req, res) => {
  try {
    const Product_ID = req.params.id;
    const User_ID = req.user.userId;

    // Delete the specific item from user's wishlist
    const [results] = await conn.query(
      "DELETE FROM wishlist WHERE Product_ID = ? AND User_ID = ?", 
      [Product_ID, User_ID]
    );
    
    if (results.affectedRows === 0) {
      return res.status(404).json({ error: "Item not found in wishlist" });
    }
    
    res.status(200).json({ message: "Removed from wishlist successfully" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Server Failed" });
  }
};

// Show wishlist for specific user
const showWishlist = async (req, res) => {
  try {
    const User_ID = req.user.userId;
    const [results] = await conn.query(wishListQueries.showWishlist, [User_ID]);
    
    if (results.length === 0) {
      return res.status(200).json({ message: "No items in wishlist", data: [] });
    }
    
    res.status(200).json({ message: "Wishlist retrieved successfully", data: results });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Server Failed" });
  }
};

module.exports = {insertWishlistCtrl, showWishlist, deletetWishlistCtrl}
