
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
  searchPriceRange: `SELECT * FROM products WHERE Price BETWEEN ? AND ?`,
};
module.exports = {productQueries,wishListQueries,searchQueries};
  