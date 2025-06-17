const conn = require("../../setting/connection");
const {chartQueries} = require('./query/chartQueries')

const chartCtrl = async (req, res) => {
  try {
    const [rows] = await conn.query(chartQueries.monthSale);
    const monthlySales = Array(12).fill(0);
    for (const row of rows) {
      monthlySales[row.month - 1] = row.total;
    }

    res.json({ sales: monthlySales });
  } catch (err) {
    console.error("Chart error:", err);
    res.status(500).json({ error: "Internal server error" });
  }
};

module.exports = {
  chartCtrl,
};
