const mysql2 = require('mysql2/promise');

const host = 'localhost' //or '100.75.106.34'
const user = 'root'
const password = ''
const database = 'tuvsportshoes'
const conn = mysql2.createPool({
    host,
    user,
    password,
    database
})
module.exports = conn;
