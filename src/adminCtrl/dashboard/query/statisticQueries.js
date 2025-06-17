const statisticQuery = {
    statistic : `
  SELECT 
    MONTH(o.Created_At) AS month,
    COUNT(o.Order_Id) AS total,
    SUM(oi.Total_Amount) AS revenue
  FROM orders o
  JOIN orders oi ON o.Order_Id = oi.Order_Id
  WHERE YEAR(o.Created_At) = YEAR(NOW())
  GROUP BY MONTH(o.Created_At)
  ORDER BY month;
`}

module.exports = {
  statisticQuery
};
