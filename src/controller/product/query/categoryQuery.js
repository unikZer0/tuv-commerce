//all
const cateQueries = {
     getProductsQuery : `
  SELECT 
    p.Product_ID,
    p.Name ,
    p.Description,
    p.Brand,
    p.Image,
    p.Price,
    i.Size,
    i.Color,
    i.Quantity
FROM 
    products p
JOIN 
    inventory i ON p.Product_ID = i.Product_ID;
`,
 getCateQuery :`
  SELECT 
    p.Product_ID,
    p.Name ,
    p.Description,
    p.Brand,
    p.Image,
    p.Price,
    i.Size,
    i.Color,
    i.Quantity
FROM 
    products p
JOIN 
    inventory i ON p.Product_ID = i.Product_ID WHERE p.productType_ID = ?
`
}

module.exports = {cateQueries};
