const mysql2 = require('mysql2/promise');
require('dotenv').config();
const host = process.env.HOST//or '100.75.106.34'
const user = process.env.USER
const password = process.env.PASSWORD
const database = process.env.DATABASE || 'tuvsport_v3' // Default to 'tuvsport_v3' if not set
const conn = mysql2.createPool({
    host,
    user,
    password,
    database
})
module.exports = conn;
