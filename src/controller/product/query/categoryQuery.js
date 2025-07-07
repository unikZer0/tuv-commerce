//all
const cateQueries = {
//      getProductsQuery : `
// SELECT 
//         p.Product_ID,
//         p.Name,
//         p.Description,
//         p.Brand,
//         p.Image,
//         p.Price,
//         GROUP_CONCAT(DISTINCT i.Size ORDER BY i.Size SEPARATOR ', ') AS Sizes,
//         GROUP_CONCAT(DISTINCT i.Color ORDER BY i.Color SEPARATOR ', ') AS Colors,
//         SUM(i.Quantity) AS Total_Quantity
//       FROM 
//         products p
//       JOIN 
//         inventory i ON p.Product_ID = i.Product_ID
//       GROUP BY 
//         p.Product_ID
//       LIMIT ? OFFSET ?
// `,
getProductsQuery :`SELECT 
    p.Product_ID,
    p.Name,
    p.Description,
    p.Brand,
    p.Image,
    p.Price,
    CASE 
        WHEN COUNT(i.Inventory_ID) > 0 THEN
            CONCAT('[', GROUP_CONCAT(
                CONCAT(
                    '{"Size":"', IFNULL(i.Size, ''), '",',
                    '"Color":"', IFNULL(i.Color, ''), '",',
                    '"Quantity":', IFNULL(i.Quantity, 0), '}'
                )
            ), ']')
        ELSE '[]'
    END AS Stock
FROM 
    products p
LEFT JOIN 
    inventory i ON p.Product_ID = i.Product_ID
GROUP BY 
    p.Product_ID, p.Name, p.Description, p.Brand, p.Image, p.Price
LIMIT ? OFFSET ?
`,
 getCateQuery :`
SELECT 
        p.Product_ID,
        p.Name,
        p.Description,
        p.Brand,
        p.Image,
        p.Price,
        CASE 
            WHEN COUNT(i.Inventory_ID) > 0 THEN
                CONCAT('[', GROUP_CONCAT(
                    CONCAT(
                        '{"Size":"', IFNULL(i.Size, ''), '",',
                        '"Color":"', IFNULL(i.Color, ''), '",',
                        '"Quantity":', IFNULL(i.Quantity, 0), '}'
                    )
                ), ']')
            ELSE '[]'
        END AS Stock
      FROM 
        products p
      LEFT JOIN 
        inventory i ON p.Product_ID = i.Product_ID
      WHERE 
        p.productType_ID = ?
      GROUP BY 
        p.Product_ID, p.Name, p.Description, p.Brand, p.Image, p.Price
      LIMIT ? OFFSET ?
    
`
}

module.exports = {cateQueries};
