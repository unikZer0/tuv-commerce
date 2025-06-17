const conn = require("../../setting/connection")
const {chartQueries} = require("./query/chartQueries")

const chartCtrl = async (req,res) => {
      const[result] = await conn.query(`select count(Order_Id) as allorder from orders WHERE MONTH(Created_At) = MONTH(NOW()) `)
      const six = result[0]
  const monthlySales = [1, 0, 0, 0, 0, six, 0, 0, 0, 0, 0, 0];
  res.json({ sales: monthlySales });
}
module.exports = {
    chartCtrl,
}
