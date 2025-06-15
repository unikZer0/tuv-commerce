const conn = require('../../setting/connection')
const {monthlyTarget} = require('./query/monthlyTatgetQuery')

const monlthlyCtrl = async (req,res) => {
    const month = new Date().getMonth() + 1;
    const year = new Date().getFullYear();

  try {
    const [rows] = await conn.query(
      monthlyTarget.target,
      [month, year]
    );

    const todayRes = await conn.query(
      monthlyTarget.day,
      [month, year]
    );

    const target = rows[0].target || 0;
    const actual = rows[0].actual || 0;
    const today = todayRes[0][0].today || 0;

    const percentage = target > 0 ? (actual / target) * 100 : 0;
    console.log(percentage);
    
    res.json({
      target,
      actual,
      today,
      percentage: percentage.toFixed(2),
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
}
module.exports ={monlthlyCtrl}
