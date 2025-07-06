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
    p.Added_By,
    COALESCE(SUM(i.Quantity), 0) as totalStock
FROM 
    products p
LEFT JOIN 
    product_types pt ON p.productType_ID = pt.productType_ID
LEFT JOIN 
    inventory i ON p.Product_ID = i.Product_ID
GROUP BY 
    p.Product_ID, p.PID, p.Name, p.Brand, p.Price, p.Description, p.Status, p.Image, pt.productType_Name, p.Added_By
ORDER BY 
    p.Product_ID DESC;
`,
    getProductById: `SELECT 
    p.*,
    pt.productType_Name AS productType,
    COALESCE(SUM(i.Quantity), 0) as totalStock
FROM products p
LEFT JOIN product_types pt ON p.productType_ID = pt.productType_ID
LEFT JOIN inventory i ON p.Product_ID = i.Product_ID
WHERE p.Product_ID = ?
GROUP BY p.Product_ID, p.PID, p.Name, p.Brand, p.Price, p.Description, p.Status, p.Image, p.productType_ID, pt.productType_Name, p.Added_By`,
    
    getProductWithInventory: `SELECT 
    p.*,
    pt.productType_Name AS productType,
    i.Inventory_ID,
    i.Size,
    i.Color,
    i.Quantity
FROM products p
LEFT JOIN product_types pt ON p.productType_ID = pt.productType_ID
LEFT JOIN inventory i ON p.Product_ID = i.Product_ID
WHERE p.Product_ID = ?`,
    
    getProductsByType: `SELECT * FROM products WHERE productType_ID = ?`,
    
    insertProduct: `
        INSERT INTO products 
        (PID, Name, Brand, Price, Description, Status, Image, productType_ID, Added_By)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `,
    
    insertInventory: `
        INSERT INTO inventory 
        (Product_ID, Size, Color, Quantity)
        VALUES (?, ?, ?, ?)
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
    
    updateInventory: `
        UPDATE inventory SET
            Size = ?,
            Color = ?,
            Quantity = ?
        WHERE Inventory_ID = ?
    `,
    
    deleteProduct: `DELETE FROM products WHERE Product_ID = ?`,
    deleteInventoryByProduct: `DELETE FROM inventory WHERE Product_ID = ?`,
    
    searchProductByName: `SELECT 
    p.*,
    pt.productType_Name AS productType,
    COALESCE(SUM(i.Quantity), 0) as totalStock
FROM products p
LEFT JOIN product_types pt ON p.productType_ID = pt.productType_ID
LEFT JOIN inventory i ON p.Product_ID = i.Product_ID
WHERE p.Name LIKE ?
GROUP BY p.Product_ID, p.PID, p.Name, p.Brand, p.Price, p.Description, p.Status, p.Image, pt.productType_Name, p.Added_By`,
    
    searchProductByBrand: `SELECT * FROM products WHERE Brand LIKE ?`,
    searchProductByPriceRange: `SELECT * FROM products WHERE Price BETWEEN ? AND ?`,
    checkProductExists: `SELECT COUNT(*) as count FROM products WHERE Product_ID = ?`,
    
    // Inventory specific queries
    getInventoryByProductId: `SELECT * FROM inventory WHERE Product_ID = ?`,
    checkInventoryExists: `SELECT COUNT(*) as count FROM inventory WHERE Product_ID = ?`,
    
    // Transaction queries
    beginTransaction: `START TRANSACTION`,
    commitTransaction: `COMMIT`,
    rollbackTransaction: `ROLLBACK`
}

module.exports = {
    productQueries
}
