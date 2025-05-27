//address
const addressQueries = {
    insert:`INSERT INTO address (User_ID,Village,District,Province,Transportation,Branch) VALUES(?,?,?,?,?,?)`,
    show:`SELECT u.FirstName ,u.LastName ,u.Phone,a.Transportation,a.Branch, a.Village, a.District ,a.Province FROM address a JOIN users u ON a.User_ID = u.User_ID WHERE u.User_ID = ?`
}
const orderQuery = {
    insertOrder:`INSERT INTO orders SET ?`,
    insertShipment:`INSERT INTO shipment SET ?`,
    insertCart:`INSERT INTO cart SET ?`,
    callToDelete:`SELECT Product_ID,Quantity,Size,Color FROM cart WHERE Order_ID = ?`,
    deleteStock:`UPDATE inventory SET Quantity = Quantity - ? WHERE Product_ID = ? AND  Size = ? AND  Color = ?`,
    checkStock:`SELECT Quantity FROM inventory WHERE Product_ID = ? AND Size = ? AND Color = ?`,
    checkProduct:`SELECT * FROM products WHERE Product_ID = ?`,
    checkCart:`SELECT Quantity,Unit_Price FROM cart WHERE Product_ID = ?`,
    updateSession:`UPDATE orders SET ? WHERE session_id = ?`,
    findIdBysession:`SELECT Order_ID FROM orders WHERE session_id = ?`
}
module.exports = {
    addressQueries,
    orderQuery
}
