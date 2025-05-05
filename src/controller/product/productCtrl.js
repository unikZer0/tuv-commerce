const conn = require('../../setting/connection');
const {cateQueries} = require('./query/categoryQuery')
const {cartQueries,productQueries,wishListQueries} = require('./query/productQuery')
const { sucMessage, errMessage } = require('../../service/messages');

// ================category
const getProducts = async (req,res)=>{
    try {
        const [results]= await conn.query(cateQueries.getProductsQuery);
        res.json({ message: sucMessage.getProduct, products: results });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: errMessage.serverError || "Internal Server Error" });
    }
}
const getCategories = async (req,res) => {
    try {
        const productType_ID = req.params.id
        const [results] = await conn.query(cateQueries.getCateQuery,[productType_ID]);
        res.json({ message: sucMessage.seeAll, products: results });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: errMessage.serverError || "Internal Server Error" });
    }
};
//========================== cart
//insert
const insertCartCtrl = async (req, res) => {
    try {
        const { Product_ID, Size, Color, Quantity, Unit_price } = req.body;
        console.log(Product_ID, Size, Color, Quantity, Unit_price);
        
        const [results] = await conn.query(cartQueries.insert, [Product_ID, Size, Color, Quantity, Unit_price]);
        res.status(200).json({ message: "created", data: results });
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: "Failed to insert cart item" });
    }
};
//delete
const deleteCartCtrl = async (req, res) => {
    try {
        const Order_Items_ID = req.params.id;

        const [results] = await conn.query(cartQueries.delete, [Order_Items_ID]);

        if (results.length === 0) {
            return res.status(404).json({ message: "No product found" });
        }

        res.status(200).json({ message: "Cart item deleted successfully", data: results });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Failed to delete cart item" });
    }
};

//================ products
//show product (single)
const getProductCtrl = async (req,res)=>{
    try {
        const Product_ID = req.params.id
        const [results] = await conn.query(productQueries.showProduct,[Product_ID]);
        if (results.length === 0) {
            return res.status(404).json({ message: "No product found" });
        }
        res.status(200).json({ message: "show product", data: results });
        
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: "Failed to get item" });
    }
}
//==================wishlist
//insert
const insertWishlistCtrl = async (req,res) =>{
    try {
        const Date_Added = new Date();
        const {User_ID,Product_ID} = req.body;
        if (!User_ID || !Product_ID) {
            return res.status(400).json({ error: 'User_ID and Product_ID are required' });
          }
        const [results] = await conn.query(wishListQueries.insert,[User_ID,Product_ID,Date_Added])
        res.status(201).json({message:"show product",data:results})
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: "Server Failed" });
    }
}
//delete
const deletetWishlistCtrl = async (req,res) =>{
    try {
        const Wishlist_ID = req.params.id;
        const [results] = await conn.query(wishListQueries.delete,[Wishlist_ID])
        const [showAll] = await conn.query(wishListQueries.showAll);
        res.status(201).json({message:sucMessage.delete,data:showAll})
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: "Server Failed" });
    }
}
//show each  user
const showWishlist = async (req,res)=>{
    try {
        const User_ID = req.params.id;
        const [results] = await conn.query(wishListQueries.showWishlist,[User_ID]);
        if (results.length === 0) {
            return res.status(404).json({ message: "No selected" });
        }
        res.status(200).json({message:"show wishlist",data:results})
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: "Server Failed" });
    }
}
module.exports = {
    getProducts,
    getCategories,
    insertCartCtrl,
    deleteCartCtrl,
    getProductCtrl,
    insertWishlistCtrl,
    deletetWishlistCtrl,
    showWishlist
};
