const cartQueries = {
    insert: `INSERT INTO cart (Product_ID, Size, Color, Quantity, Unit_Price) VALUES (?, ?, ?, ?, ?)`,
    delete:`DELETE FROM cart WHERE Order_Items_ID = ?`
  };
  
  module.exports = {cartQueries};
  