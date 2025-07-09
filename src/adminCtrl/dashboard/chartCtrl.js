const conn = require("../../setting/connection")
const {chartQueries} = require("./query/chartQueries")

const chartCtrl = async (req, res) => {
  try {
    const [results] = await conn.query(`
      SELECT MONTH(Created_At) AS month, COUNT(Order_Id) AS count
      FROM orders
      WHERE YEAR(Created_At) = YEAR(NOW())
      GROUP BY MONTH(Created_At)
    `);

    const monthlySales = new Array(12).fill(0);
    results.forEach(row => {
      const monthIndex = row.month - 1;
      monthlySales[monthIndex] = row.count;
    });

    res.json({ sales: monthlySales });
  } catch (err) {
    console.error('Error fetching monthly sales:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
};

module.exports = {
  chartCtrl,
};

