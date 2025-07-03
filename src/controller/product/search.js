const conn = require("../../setting/connection");
const { productQueries } = require("./query/productQuery");


// search products
const searchProducts = async (req, res) => {
  try {
    // เปลี่ยนจาก req.query เป็น req.body เพื่อรองรับ POST request
    const { q, category, productType, brand, sort } = req.body;
    
    // ใช้ query เดียวกับ categoryCtrl เพื่อให้ได้ข้อมูล Stock
    let query = `
      SELECT p.*, 
             CONCAT('[', GROUP_CONCAT(JSON_OBJECT(
               'Size', i.Size, 
               'Color', i.Color, 
               'Quantity', i.Quantity
             )), ']') as Stock
      FROM products p
      LEFT JOIN inventory i ON p.Product_ID = i.Product_ID
      WHERE 1=1
    `;
    const queryParams = [];
    const searchBy = [];

    if (q && q.trim() !== '' && q.trim() !== '*') {
      // ค้นหาชื่อสินค้า, คำอธิบาย และแบรนด์ด้วย LIKE
      query += " AND (p.Name LIKE ? OR p.Description LIKE ? OR p.Brand LIKE ?";
      queryParams.push(`%${q}%`, `%${q}%`, `%${q}%`);
      searchBy.push('product name, description, or brand');

      // ถ้า q เป็นตัวเลข → ค้นหาราคา
      if (!isNaN(q) && !isNaN(parseFloat(q))) {
        query += " OR p.Price = ?";
        queryParams.push(parseFloat(q));
        searchBy.push('price');
      }

      // ตรวจสอบว่า q ตรงกับประเภทที่มีในฐานข้อมูลหรือไม่
      const [categoryResults] = await conn.query('SELECT * FROM product_types WHERE productType_Name LIKE ?', [`%${q}%`]);
      if (categoryResults.length > 0) {
        query += " OR p.productType_ID IN (" + categoryResults.map(() => '?').join(',') + ")";
        categoryResults.forEach(cat => queryParams.push(cat.productType_ID));
        searchBy.push('category');
      }

      query += ")";
    }

    // เพิ่มฟิลเตอร์ประเภทถ้ามี (legacy category support)
    if (category && category.trim() !== '') {
      query += " AND p.productType_ID = ?";
      queryParams.push(category);
      searchBy.push('category filter');
    }

    // เพิ่มฟิลเตอร์ product type ถ้ามี
    if (productType && productType.trim() !== '') {
      query += " AND p.productType_ID = ?";
      queryParams.push(productType);
      searchBy.push('product type filter');
    }

    // เพิ่มฟิลเตอร์ brand ถ้ามี
    if (brand && brand.trim() !== '') {
      query += " AND p.Brand = ?";
      queryParams.push(brand);
      searchBy.push('brand filter');
    }

    // เพิ่ม GROUP BY เพื่อรวม inventory data
    query += " GROUP BY p.Product_ID";
    
    // เพิ่มการเรียงลำดับตามราคา
    if (sort === 'asc') {
      query += " ORDER BY p.Price ASC";
    } else if (sort === 'desc') {
      query += " ORDER BY p.Price DESC";
    } else {
      query += " ORDER BY p.Name";
    }

    console.log('Search Query:', query);
    console.log('Search Params:', queryParams);

    const [results] = await conn.query(query, queryParams);

    // Parse Stock JSON for each product
    const productsWithParsedStock = results.map(product => ({
      ...product,
      Stock: product.Stock ? JSON.parse(product.Stock) : []
    }));

    if (productsWithParsedStock.length === 0) {
      return res.status(200).json({ 
        message: "No products found matching your criteria", 
        searchBy,
        data: []
      });
    }

    res.status(200).json({ 
      message: "Search results", 
      searchBy, 
      count: productsWithParsedStock.length,
      data: productsWithParsedStock 
    });
  } catch (error) {
    console.error('Search error:', error);
    res.status(500).json({ error: "Failed to search products" });
  }
};

module.exports = {
  searchProducts,
};


module.exports = {
  searchProducts,
};
