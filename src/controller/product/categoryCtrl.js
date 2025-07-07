const conn = require("../../setting/connection");
const { cateQueries } = require("./query/categoryQuery");
const {sucMessage,errMessage} = require('../../service/messages')
// ================category

const getProducts = async (req, res) => {
  try {
      const page = parseInt(req.query.page) || 1;
      const limit = parseInt(req.query.limit) || 6;
      const offset = (page - 1) * limit;
      const sort = req.body.sort || req.query.sort;
      
      // Build query with sorting
      let query = cateQueries.getProductsQuery;
      
      // Add ORDER BY clause based on sort parameter
      if (sort === 'asc') {
        query = query.replace('LIMIT ? OFFSET ?', 'ORDER BY p.Price ASC LIMIT ? OFFSET ?');
      } else if (sort === 'desc') {
        query = query.replace('LIMIT ? OFFSET ?', 'ORDER BY p.Price DESC LIMIT ? OFFSET ?');
      } else {
        query = query.replace('LIMIT ? OFFSET ?', 'ORDER BY p.Name LIMIT ? OFFSET ?');
      }
      
    const [results] = await conn.query(query, [limit, offset]);
    
    // Parse the Stock JSON string for each product with error handling
    const productsWithParsedStock = results.map(product => {
      let parsedStock = [];
      try {
        if (product.Stock && product.Stock !== '[]' && product.Stock !== 'null') {
          parsedStock = JSON.parse(product.Stock);
        }
      } catch (parseError) {
        console.error('Error parsing Stock JSON for product', product.Product_ID, ':', parseError);
        parsedStock = [];
      }
      
      return {
        ...product,
        Stock: parsedStock
      };
    });

    res.json({ message: sucMessage.seeAll, page, limit, products: productsWithParsedStock });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ message: errMessage.serverError || "Internal Server Error" });
  }
};

const getCategories = async (req, res) => {
  try {
      // console.log('Query params:', req.query);
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 6;
        const offset = (page - 1) * limit;
        const sort = req.body.sort || req.query.sort;
        
    const productType_ID = req.params.id;
    
    // Build query with sorting
    let query = cateQueries.getCateQuery;
    
    // Add ORDER BY clause based on sort parameter
    if (sort === 'asc') {
      query = query.replace('LIMIT ? OFFSET ?', 'ORDER BY p.Price ASC LIMIT ? OFFSET ?');
    } else if (sort === 'desc') {
      query = query.replace('LIMIT ? OFFSET ?', 'ORDER BY p.Price DESC LIMIT ? OFFSET ?');
    } else {
      query = query.replace('LIMIT ? OFFSET ?', 'ORDER BY p.Name LIMIT ? OFFSET ?');
    }
    
    const [results] = await conn.query(query, [ productType_ID,limit, offset]);

    // Parse the Stock JSON string for each product with error handling
    const productsWithParsedStock = results.map(product => {
      let parsedStock = [];
      try {
        if (product.Stock && product.Stock !== '[]' && product.Stock !== 'null') {
          parsedStock = JSON.parse(product.Stock);
        }
      } catch (parseError) {
        console.error('Error parsing Stock JSON for product', product.Product_ID, ':', parseError);
        parsedStock = [];
      }
      
      return {
        ...product,
        Stock: parsedStock
      };
    });

    res.json({ message: sucMessage.seeAll, page, limit, products: productsWithParsedStock });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ message: errMessage.serverError || "Internal Server Error" });
  }
};

// Get all product types dynamically
const getProductTypes = async (req, res) => {
  try {
    const [results] = await conn.query('SELECT * FROM product_types ORDER BY productType_Name');
    
    res.json({ 
      message: sucMessage.seeAll, 
      data: results 
    });
  } catch (error) {
    console.error('Error fetching product types:', error);
    res
      .status(500)
      .json({ message: errMessage.serverError || "Internal Server Error" });
  }
};

// Get all brands dynamically
const getBrands = async (req, res) => {
  try {
    const [results] = await conn.query('SELECT DISTINCT Brand FROM products WHERE Brand IS NOT NULL AND Brand != "" ORDER BY Brand');
    
    // Format results to match expected structure
    const brands = results.map(row => ({
      Brand: row.Brand
    }));
    
    res.json({ 
      message: sucMessage.seeAll, 
      data: brands 
    });
  } catch (error) {
    console.error('Error fetching brands:', error);
    res
      .status(500)
      .json({ message: errMessage.serverError || "Internal Server Error" });
  }
};

module.exports = {
    getProducts,
    getCategories,
    getProductTypes,
    getBrands
}
