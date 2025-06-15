const conn = require("../../setting/connection")
const {statisticQueries} = require("./query/statisticQueries")

const statisticCtrl = async (req,res) => {
      res.json({
    months: [
      "Jan", "Feb", "Mar", "Apr", "May", "Jun",
      "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
    ],
    sales: [180, 190, 170, 160, 175, 165, 170, 205, 230, 210, 240, 235],
    revenue: [40, 30, 50, 40, 55, 40, 70, 100, 110, 120, 150, 140]
  });
}
module.exports = {
    statisticCtrl,
}
