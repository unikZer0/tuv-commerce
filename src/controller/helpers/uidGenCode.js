async function gennerateUserCode  (conn) {
    const prefix = `U`;
    const now = new Date();
    const year = now.getFullYear().toString().slice(-2);
    const month = (now.getMonth() + 1).toString().padStart(2, '0');
    const patturn = `${prefix}${year}${month}%`;

    const [rows] = await conn.query(`SELECT MAX(CAST(SUBSTRING(UID,5) AS UNSIGNED)) AS last_number FROM users WHERE UID LIKE ?`, [patturn]);

    const lastNumber = rows[0].last_number || 0;
    const newNumber = lastNumber + 1;
    const UID = `${prefix}${year}${month}${newNumber.toString().padStart(2, '0')}`;
    return UID;
};
module.exports = {
    gennerateUserCode
}
