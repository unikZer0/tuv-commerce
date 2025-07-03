const productQueries ={
  showProduct:`SELECT * FROM products WHERE Product_ID = ?`,
}
const wishListQueries = {
  showAll : `SELECT * FROM wishlist`,
  insert :`INSERT INTO wishlist (User_ID,Product_ID,Date_Added) VALUES (?,?,?)`,
  delete :`DELETE FROM wishlist WHERE Product_ID	= ?`,
  showWishlist :`SELECT w.wishlist_id,p.Product_ID, p.Name, p.Price, p.Image, w.Date_Added
  FROM wishlist w
  JOIN products p ON w.Product_ID = p.Product_ID
  WHERE w.User_ID = ?
`,

}
const searchQueries = {
  searchProduct: `SELECT * FROM products WHERE Name LIKE ? OR Description LIKE ?`,
  searchCategory: `SELECT * FROM products WHERE productType_ID = ?`, // Corrected column name
  searchBrand: `SELECT * FROM products WHERE Brand = ?`, // Corrected column name
  // Price sorting queries
  sortPriceAsc: `SELECT * FROM products ORDER BY Price ASC`,
  sortPriceDesc: `SELECT * FROM products ORDER BY Price DESC`,
  // Combined search with sorting
  searchProductSortAsc: `SELECT * FROM products WHERE Name LIKE ? OR Description LIKE ? ORDER BY Price ASC`,
  searchProductSortDesc: `SELECT * FROM products WHERE Name LIKE ? OR Description LIKE ? ORDER BY Price DESC`,
  searchCategorySortAsc: `SELECT * FROM products WHERE productType_ID = ? ORDER BY Price ASC`,
  searchCategorySortDesc: `SELECT * FROM products WHERE productType_ID = ? ORDER BY Price DESC`,
  searchBrandSortAsc: `SELECT * FROM products WHERE Brand = ? ORDER BY Price ASC`,
  searchBrandSortDesc: `SELECT * FROM products WHERE Brand = ? ORDER BY Price DESC`,
};
module.exports = {productQueries,wishListQueries,searchQueries};
  