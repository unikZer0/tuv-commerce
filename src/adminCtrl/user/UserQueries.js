const userQueries = {
    getAllUsers: `SELECT * FROM users WHERE Role_id != 1`,
    getManagers: `SELECT * FROM users WHERE Role_id = 2`,
    getCustomers: `SELECT * FROM users WHERE Role_id = 3`,
    deleteUsers: `DELETE FROM users WHERE User_ID = ?`,
    updatedUsers:`
    UPDATE users
    SET FirstName = ?, LastName = ?, Email = ?, Phone = ?, Role_id = ?, Sex = ?
    WHERE User_ID = ?
  `
}
module.exports ={
    userQueries
}
