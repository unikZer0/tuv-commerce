const chartQueries = {
    monthSale:`
      SELECT MONTH(Created_At) AS month, COUNT(Order_Id) AS total
      FROM orders
      WHERE YEAR(Created_At) = YEAR(NOW())
      GROUP BY MONTH(Created_At)
    `
}
module.exports = {
    chartQueries
}
