const userQueries = {
    getAllUsers: `SELECT * FROM users WHERE Role_id != 1`,
    getManagers: `SELECT * FROM users WHERE Role_id = 2`,
    getCustomers: `SELECT * FROM users WHERE Role_id = 3`,
}
module.exports ={
    userQueries
}
