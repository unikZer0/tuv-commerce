const conn = require("../../setting/connection");
const { cateQueries } = require("./query/categoryQuery");
const {sucMessage,errMessage} = require('../../service/messages')
// ================category

const getProducts = async (req, res) => {
  try {
        const page = parseInt(req.query.page) || 1;
      const limit = parseInt(req.query.limit) || 5;
      const offset = (page - 1) * limit;
    const [results] = await conn.query(cateQueries.getProductsQuery, [limit, offset]);
    res.json({ message: sucMessage.seeAll, page, limit, products: results });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ message: errMessage.serverError || "Internal Server Error" });
  }
};
const getCategories = async (req, res) => {
  try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const offset = (page - 1) * limit;
    const productType_ID = req.params.id;
    const [results] = await conn.query(cateQueries.getCateQuery, [ productType_ID,limit, offset,
     
    ]);
    res.json({ message: sucMessage.seeAll, page, limit, products: results });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ message: errMessage.serverError || "Internal Server Error" });
  }
};
module.exports = {
    getProducts,
    getCategories
}
