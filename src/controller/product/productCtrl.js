const conn = require('../../setting/connection');
const cateQueries = require('./query/categoryQuery')
const {cartQueries} = require('./query/productQuery')
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
const deleteCartCtrl = async (req,res) =>{
    try {
        const {Order_Items_ID} = req.body;
        const [results] = await conn.query(cartQueries.delete,[Order_Items_ID])
        res.status(200).json({ message: "deleted", data: results });
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: "Failed to delete cart item" });
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
    deleteCartCtrl
};
