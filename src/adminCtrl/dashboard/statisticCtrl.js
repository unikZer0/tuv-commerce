const conn = require("../../setting/connection");

const statisticCtrl = async (req, res) => {
  try {
    const [results] = await conn.query(`
      SELECT 
        MONTH(Created_At) AS month, 
        COUNT(Order_Id) AS sales,
        SUM(Total_Amount) AS revenue
      FROM orders
      WHERE YEAR(Created_At) = YEAR(NOW())
      GROUP BY MONTH(Created_At)
    `);

    const monthlySales = new Array(12).fill(0);
    const monthlyRevenue = new Array(12).fill(0);

    results.forEach(row => {
      const index = row.month - 1;
      monthlySales[index] = row.sales;
      monthlyRevenue[index] = row.revenue || 0;
    });

    res.json({
      months: [
        "Jan", "Feb", "Mar", "Apr", "May", "Jun",
        "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
      ],
      sales: monthlySales,
      revenue: monthlyRevenue
    });
  } catch (err) {
    console.error("Error fetching statistics:", err);
    res.status(500).json({ error: "Internal server error" });
  }
};

module.exports = {
  statisticCtrl,
};
