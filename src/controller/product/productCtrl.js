const conn = require("../../setting/connection");
const { productQueries } = require("./query/productQuery");

//================ products
//show product (single)
const getProductCtrl = async (req, res) => {
  try {
    const Product_ID = req.params.id;
    const [results] = await conn.query(productQueries.showProduct, [
      Product_ID,
    ]);
    if (results.length === 0) {
      return res.status(404).json({ message: "No product found" });
    }
    res.status(200).json({ message: "show product", data: results });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Failed to get item" });
  }
};
module.exports = {
  getProductCtrl,
};
