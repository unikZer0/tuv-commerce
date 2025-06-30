const conn = require("../../setting/connection");
const { productQueries } = require("./query/productQuery");


// search products
const searchProducts = async (req, res) => {
  try {
    const { q, min_price, max_price } = req.query;
    let query = "SELECT * FROM products WHERE 1=1";
    const queryParams = [];
    const searchBy = [];

    if (q) {
      // ค้นหาชื่อสินค้าและคำอธิบาย
      query += " AND (Name LIKE ? OR Description LIKE ?";
      queryParams.push(`%${q}%`, `%${q}%`);
      searchBy.push('product name or description');

      // ถ้า q เป็นตัวเลข → ค้นหาราคา
      if (!isNaN(q)) {
        query += " OR Price = ?";
        queryParams.push(q);
        searchBy.push('price');
      }

      // ตรวจสอบว่า q ตรงกับแบรนด์ที่มีในฐานข้อมูลหรือไม่
      const [brandResults] = await conn.query('SELECT * FROM products WHERE Brand = ?', [q]);
      if (brandResults.length > 0) {
        query += " OR Brand = ?";
        queryParams.push(q);
        searchBy.push('brand');
      }

      // ตรวจสอบว่า q ตรงกับประเภทที่มีในฐานข้อมูลหรือไม่
      const [categoryResults] = await conn.query('SELECT * FROM product_types WHERE TypeName = ?', [q]);
      if (categoryResults.length > 0) {
        query += " OR productType_ID = ?";
        queryParams.push(categoryResults[0].id); // สมมุติ id คือ primary key ของประเภทสินค้า
        searchBy.push('category');
      }

      query += ")";
    }

    // เพิ่มช่วงราคาถ้ามี
    if (min_price && max_price) {
      query += " AND Price BETWEEN ? AND ?";
      queryParams.push(min_price, max_price);
      searchBy.push('price range');
    } else if (min_price) {
      query += " AND Price >= ?";
      queryParams.push(min_price);
      searchBy.push('min price');
    } else if (max_price) {
      query += " AND Price <= ?";
      queryParams.push(max_price);
      searchBy.push('max price');
    }

    const [results] = await conn.query(query, queryParams);

    if (results.length === 0) {
      return res.status(404).json({ message: "No products found matching your criteria", searchBy });
    }

    res.status(200).json({ message: "Search results", searchBy, data: results });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Failed to search products" });
  }
};

module.exports = {
  searchProducts,
};


module.exports = {
  searchProducts,
};
