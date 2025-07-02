// ProductQueries.js
const productQueries = {
    getAllProducts: `SELECT 
    p.Product_ID,
    p.PID,
    p.Name,
    p.Brand,
    p.Price,
    p.Description,
    p.Status,
    p.Image,
    pt.productType_Name AS productType,
    p.Added_By
FROM 
    products p
LEFT JOIN 
    product_types pt ON p.productType_ID = pt.productType_ID;
`,
    getProductById: `SELECT * FROM products WHERE Product_ID = ?`,
    getProductsByType: `SELECT * FROM products WHERE productType_ID = ?`,
    insertProduct: `
        INSERT INTO products 
        (PID, Name, Brand, Price, Description, Status, Image, productType_ID, Added_By)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `,
    updateProduct: `
        UPDATE products SET
            PID = ?,
            Name = ?,
            Brand = ?,
            Price = ?,
            Description = ?,
            Status = ?,
            Image = ?,
            productType_ID = ?,
            Added_By = ?
        WHERE Product_ID = ?
    `,
    deleteProduct: `DELETE FROM products WHERE Product_ID = ?`,
    searchProductByName: `SELECT * FROM products WHERE Name LIKE ?`,
    searchProductByBrand: `SELECT * FROM products WHERE Brand LIKE ?`,
    searchProductByPriceRange: `SELECT * FROM products WHERE Price BETWEEN ? AND ?`,
    checkProductExists: `SELECT COUNT(*) as count FROM products WHERE Product_ID = ?`
}

module.exports = {
    productQueries
}
