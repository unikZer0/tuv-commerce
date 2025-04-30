const conn = require('../../setting/connection');
const queries = require('./productQuery');
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
const getProducts = (req, res) => fetchProducts(res, queries.getProductsQuery, sucMessage.getproduct);
const getSports = (req, res) => fetchProducts(res, queries.getSportsQuery, sucMessage.getSports);
const getWorks = (req, res) => fetchProducts(res, queries.getworkQuery, sucMessage.getWork);
const getFasions = (req, res) => fetchProducts(res, queries.getfasionQuery, sucMessage.getFashion);
const getHomes = (req, res) => fetchProducts(res, queries.gethomeQuery, sucMessage.getHome);
const getBoots = (req, res) => fetchProducts(res, queries.getbootQuery, sucMessage.getBoot);

//insert

module.exports = {
    getProducts,
    getSports,
    getWorks,
    getFasions,
    getHomes,
    getBoots
};
