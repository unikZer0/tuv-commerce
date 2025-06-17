const monthlyTarget = {
    target:`SELECT 
         SUM(Target_Amount) AS target,
         SUM(Actual_Amount) AS actual
       FROM monthly_targets
       WHERE Target_Month = ? AND Target_Year = ?`,
    day:`SELECT SUM(Actual_Amount) as today
       FROM monthly_targets
       WHERE DAY(Created_At) = DAY(NOW()) 
         AND MONTH(Created_At) = ? 
         AND YEAR(Created_At) = ?`
}

module.exports = {
    monthlyTarget
}
