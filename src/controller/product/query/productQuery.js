const productQueries ={
  showProduct:`SELECT * FROM products WHERE Product_ID = ?`,
  // Popular products: by most reviews (top 8) with Stock data
  getPopularProducts: `
    SELECT 
      p.*,
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
    FROM products p
    LEFT JOIN (
      SELECT Product_ID, COUNT(*) as review_count 
      FROM reviews 
      GROUP BY Product_ID
    ) r ON p.Product_ID = r.Product_ID
    LEFT JOIN inventory i ON p.Product_ID = i.Product_ID
    GROUP BY p.Product_ID, p.Name, p.Price, p.Image, p.Description, p.Brand, p.productType_ID, r.review_count
    ORDER BY IFNULL(r.review_count, 0) DESC, p.Product_ID DESC
    LIMIT 8
  `,
  // Latest products: by Product_ID (top 8 newest) with Stock data
  getLatestProducts: `
    SELECT 
      p.*,
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
    FROM products p
    LEFT JOIN inventory i ON p.Product_ID = i.Product_ID
    GROUP BY p.Product_ID, p.Name, p.Price, p.Image, p.Description, p.Brand, p.productType_ID
    ORDER BY p.Product_ID DESC
    LIMIT 8
  `
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

const reviewQueries = {
  // Get all reviews for a product with user information
  getProductReviews: `
    SELECT r.Review_ID, r.User_ID, r.Product_ID, r.Rating, r.Comment, r.Review_Date,
           u.FirstName, u.LastName, u.Images as UserImage
    FROM reviews r
    JOIN users u ON r.User_ID = u.User_ID
    WHERE r.Product_ID = ?
    ORDER BY r.Review_Date DESC
  `,
  
  // Get review summary for a product (average rating and total count)
  getReviewSummary: `
    SELECT 
      COUNT(*) as totalReviews,
      AVG(Rating) as averageRating,
      SUM(CASE WHEN Rating = 5 THEN 1 ELSE 0 END) as rating5,
      SUM(CASE WHEN Rating = 4 THEN 1 ELSE 0 END) as rating4,
      SUM(CASE WHEN Rating = 3 THEN 1 ELSE 0 END) as rating3,
      SUM(CASE WHEN Rating = 2 THEN 1 ELSE 0 END) as rating2,
      SUM(CASE WHEN Rating = 1 THEN 1 ELSE 0 END) as rating1
    FROM reviews 
    WHERE Product_ID = ?
  `,
  
  // Check if user already reviewed this product
  checkUserReview: `
    SELECT Review_ID FROM reviews 
    WHERE User_ID = ? AND Product_ID = ?
  `,
  
  // Insert new review
  insertReview: `
    INSERT INTO reviews (User_ID, Product_ID, Rating, Comment, Review_Date) 
    VALUES (?, ?, ?, ?, NOW())
  `,
  
  // Update existing review
  updateReview: `
    UPDATE reviews 
    SET Rating = ?, Comment = ?, Review_Date = NOW() 
    WHERE User_ID = ? AND Product_ID = ?
  `,
  
  // Delete review
  deleteReview: `
    DELETE FROM reviews 
    WHERE User_ID = ? AND Product_ID = ?
  `,
  
  // Get user's review for a specific product
  getUserReview: `
    SELECT * FROM reviews 
    WHERE User_ID = ? AND Product_ID = ?
  `
};

module.exports = {productQueries,wishListQueries,searchQueries,reviewQueries};
  