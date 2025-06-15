const kpisQuery ={
    orders:`SELECT COUNT(*) AS count FROM orders`,
    customers:`SELECT COUNT(*) AS count FROM users where Role_id = 3`,
}
module.exports = {
    kpisQuery
}
