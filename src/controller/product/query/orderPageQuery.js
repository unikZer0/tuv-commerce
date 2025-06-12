//address
const addressQueries = {
    insert:`INSERT INTO address (AID,User_ID,Village,District,Province,Transportation,Branch) VALUES(?,?,?,?,?,?,?)`,
    show:`SELECT a.Address_ID,u.FirstName ,u.LastName ,u.Phone,a.Transportation,a.Branch, a.Village, a.District ,a.Province FROM address a JOIN users u ON a.User_ID = u.User_ID WHERE u.User_ID = ?`,
    edit:`update address set Village = ? , District = ? , Province =?, Transportation=?,Branch = ? where Address_ID = ? `,
}
const orderQuery = {
  insertOrder: `INSERT INTO orders SET ?`,
  insertShipment: `INSERT INTO shipment SET ?`,
  insertCart: `INSERT INTO cart SET ?`,
  callToDelete: `SELECT Product_ID, Quantity, Size, Color FROM cart WHERE Order_ID = ?`,
  deleteStock: `UPDATE inventory SET Quantity = Quantity - ? WHERE Product_ID = ? AND Size = ? AND Color = ?`,
  checkStock: `SELECT Quantity FROM inventory WHERE Product_ID = ? AND Size = ? AND Color = ?`,
  checkProduct: `SELECT * FROM products WHERE Product_ID = ?` 
};

module.exports = {
    addressQueries,
    orderQuery
}
