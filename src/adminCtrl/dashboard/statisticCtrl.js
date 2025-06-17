const conn = require("../../setting/connection")
const {statisticQuery} = require("./query/statisticQueries")

const statisticCtrl = async (req,res) => {
  const [rows] = await conn.query(statisticQuery.statistic);
    const monthlySales = Array(12).fill(0);
    const monthlyRevenue = Array(12).fill(0);
    
    for (const row of rows) {
      monthlySales[row.month - 1] = row.total;
      monthlyRevenue[row.month - 1] = row.revenue || 0;
    }
    
    res.json({ sales: monthlySales ,
      months: [
        "Jan", "Feb", "Mar", "Apr", "May", "Jun",
        "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
      ],
    sales: monthlySales,
    revenueData: monthlyRevenue
  });
}
module.exports = {
    statisticCtrl,
}
