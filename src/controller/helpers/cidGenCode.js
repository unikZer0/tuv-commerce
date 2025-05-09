async function gennerateCartCode  (conn) {
    const prefix = `C`;
    const now = new Date();
    const year = now.getFullYear().toString().slice(-2);
    const month = (now.getMonth() + 1).toString().padStart(2, '0');
    const patturn = `${prefix}${year}${month}%`;

    const [rows] = await conn.query(`SELECT MAX(CAST(SUBSTRING(CID,5) AS UNSIGNED)) AS last_number FROM cart WHERE CID LIKE ?`, [patturn]);
    const lastNumber = rows[0].last_number || 0;
    const newNumber = lastNumber + 1;
    const CID = `${prefix}${year}${month}${newNumber.toString().padStart(2, '0')}`;
    return CID;
};
module.exports = {
    gennerateCartCode
}
