//all
const getProductsQuery = `
  SELECT 
    p.Product_ID,
    p.Name ,
    p.Description,
    p.Brand,
    p.Image,
    p.Category,
    p.Price,
    i.Size,
    i.Color,
    i.Quantity
FROM 
    products p
JOIN 
    inventory i ON p.Product_ID = i.Product_ID;
`;
const getSportsQuery = `
  SELECT 
    p.Product_ID,
    p.Name ,
    p.Description,
    p.Brand,
    p.Image,
    p.Category,
    p.Price,
    i.Size,
    i.Color,
    i.Quantity
FROM 
    products p
JOIN 
    inventory i ON p.Product_ID = i.Product_ID WHERE p.productType_ID = 1
`;
const getworkQuery = `
  SELECT 
    p.Product_ID,
    p.Name ,
    p.Description,
    p.Brand,
    p.Image,
    p.Category,
    p.Price,
    i.Size,
    i.Color,
    i.Quantity
FROM 
    products p
JOIN 
    inventory i ON p.Product_ID = i.Product_ID WHERE p.productType_ID = 2
`;
const getfasionQuery = `
  SELECT 
    p.Product_ID,
    p.Name ,
    p.Description,
    p.Brand,
    p.Image,
    p.Category,
    p.Price,
    i.Size,
    i.Color,
    i.Quantity
FROM 
    products p
JOIN 
    inventory i ON p.Product_ID = i.Product_ID WHERE p.productType_ID = 3
`;
const gethomeQuery = `
  SELECT 
    p.Product_ID,
    p.Name ,
    p.Description,
    p.
    p.Brand,
    p.Image,
    p.Category,
    p.Price,
    i.Size,
    i.Color,
    i.Quantity
FROM 
    products p
JOIN 
    inventory i ON p.Product_ID = i.Product_ID WHERE p.productType_ID = 4
`;
const getbootQuery = `
  SELECT 
    p.Product_ID,
    p.Name ,
    p.Description,
    p.Brand,
    p.Image,
    p.Category,
    p.Price,
    i.Size,
    i.Color,
    i.Quantity
FROM 
    products p
JOIN 
    inventory i ON p.Product_ID = i.Product_ID WHERE p.productType_ID = 5
`;

module.exports = {getProductsQuery,getSportsQuery,getworkQuery,getfasionQuery,gethomeQuery,getbootQuery};
