const conn = require("../../setting/connection");
const { cateQueries } = require("./query/categoryQuery");
// ================category

const getProducts = async (req, res) => {
  try {
    const [results] = await conn.query(cateQueries.getProductsQuery);
    res.json({ message: sucMessage.getProduct, products: results });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ message: errMessage.serverError || "Internal Server Error" });
  }
};
const getCategories = async (req, res) => {
  try {
    const productType_ID = req.params.id;
    const [results] = await conn.query(cateQueries.getCateQuery, [
      productType_ID,
    ]);
    res.json({ message: sucMessage.seeAll, products: results });
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
