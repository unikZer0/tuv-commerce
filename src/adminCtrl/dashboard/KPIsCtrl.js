const conn = require("../../setting/connection")
const {KPIsQueries} = require("./query/KPIsQueries")

const dataKpisCtrl = async (req,res)=>{
    try {
        const [order] = await conn.query(KPIsQueries.orders)
        const [customer] = await conn.query(KPIsQueries.customers)
        const orderdata = order[0]
        const customerdata = customer[0]
        res.status(200).json({message:"success orders ",orderdata:orderdata,customerdata:customerdata})
    } catch (error) {
        console.log(error);
        res.status(500).json({message:"no ok"})
    }
}
module.exports = {
    dataKpisCtrl,
}
