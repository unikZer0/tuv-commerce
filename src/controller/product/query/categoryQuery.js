//all
const cateQueries = {
     getProductsQuery : `
SELECT 
    p.Product_ID,
    p.Name,
    p.Description,
    p.Brand,
    p.Image,
    p.Price,
    GROUP_CONCAT(DISTINCT i.Size ORDER BY i.Size SEPARATOR ', ') AS Sizes,
    GROUP_CONCAT(DISTINCT i.Color ORDER BY i.Color SEPARATOR ', ') AS Colors,
    SUM(i.Quantity) AS Total_Quantity
FROM 
    products p
JOIN 
    inventory i ON p.Product_ID = i.Product_ID
GROUP BY 
    p.Product_ID;
`,
 getCateQuery :`
SELECT 
    p.Product_ID,
    p.Name,
    p.Description,
    p.Brand,
    p.Image,
    p.Price,
    GROUP_CONCAT(DISTINCT i.Size ORDER BY i.Size SEPARATOR ', ') AS Sizes,
    GROUP_CONCAT(DISTINCT i.Color ORDER BY i.Color SEPARATOR ', ') AS Colors,
    SUM(i.Quantity) AS Total_Quantity
FROM 
    products p
JOIN 
    inventory i ON p.Product_ID = i.Product_ID WHERE p.productType_ID = ?
GROUP BY 
    p.Product_ID;
    
`
}

module.exports = {cateQueries};
