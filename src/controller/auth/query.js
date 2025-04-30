//Login
const loginQuery = `SELECT * FROM users WHERE Email = ? OR Phone = ? `;

//register
const registerQuery = `INSERT INTO users
  (FirstName, LastName, Email, Phone, Datebirth, Sex,
   Password, Images, Registration_Date, Role_id)
VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?);
`
const checkExist = `SELECT * FROM users WHERE Email = ? OR Phone = ?`

module.exports = {loginQuery,registerQuery,checkExist}
