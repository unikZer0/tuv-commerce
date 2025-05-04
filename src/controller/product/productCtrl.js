const conn = require('../../setting/connection');
const cateQueries = require('./query/categoryQuery')
const {cartQueries,productQueries,wishListQueries} = require('./query/productQuery')
const { sucMessage, errMessage } = require('../../service/messages');

// category
const fetchProducts = async (res, query, successMsg) => {
    try {
        const [results] = await conn.query(query);
        res.json({ message: successMsg, products: results });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: errMessage.serverError || "Internal Server Error" });
    }
};
const getProducts = (req, res) => fetchProducts(res, cateQueries.getProductsQuery, sucMessage.getproduct);
const getSports = (req, res) => fetchProducts(res, cateQueries.getSportsQuery, sucMessage.getSports);
const getWorks = (req, res) => fetchProducts(res, cateQueries.getworkQuery, sucMessage.getWork);
const getFasions = (req, res) => fetchProducts(res, cateQueries.getfasionQuery, sucMessage.getFashion);
const getHomes = (req, res) => fetchProducts(res, cateQueries.gethomeQuery, sucMessage.getHome);
const getBoots = (req, res) => fetchProducts(res, cateQueries.getbootQuery, sucMessage.getBoot);
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
    getSports,
    getWorks,
    getFasions,
    getHomes,
    getBoots,
    insertCartCtrl,
    deleteCartCtrl,
    getProductCtrl,
    insertWishlistCtrl,
    deletetWishlistCtrl,
    showWishlist
};
