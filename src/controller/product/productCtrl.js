const conn = require('../../setting/connection');
const {cateQueries} = require('./query/categoryQuery')
const {productQueries,wishListQueries} = require('./query/productQuery')
const {orderQuery} = require('./query/orderPageQuery')
const { sucMessage, errMessage } = require('../../service/messages');
const {addressQueries} = require('./query/orderPageQuery')
const { v4: uuidv4 } = require("uuid");
let rawUuid = uuidv4();
// ================category

const getProducts = async (req,res)=>{
    try {
        const [results]= await conn.query(cateQueries.getProductsQuery);
        res.json({ message: sucMessage.getProduct, products: results });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: errMessage.serverError || "Internal Server Error" });
    }
}
const getCategories = async (req,res) => {
    try {
        const productType_ID = req.params.id
        const [results] = await conn.query(cateQueries.getCateQuery,[productType_ID]);
        res.json({ message: sucMessage.seeAll, products: results });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: errMessage.serverError || "Internal Server Error" });
    }
};
//================ products
//show product (single)
const getProductCtrl = async (req,res)=>{
    try {
        const Product_ID = req.params.id
        const [results] = await conn.query(productQueries.showProduct,[Product_ID]);
        if (results.length === 0) {
            return res.status(404).json({ message: "No product found" });
        }
        res.status(200).json({ message: "show product", data: results });
        
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: "Failed to get item" });
    }
}
//==================wishlist
//insert
const insertWishlistCtrl = async (req,res) =>{
    try {
        const Date_Added = new Date();
        const User_ID = req.user.userId;
        const {Product_ID} = req.body;
        
        const [results] = await conn.query(wishListQueries.insert,[User_ID,Product_ID,Date_Added])
        if (!User_ID || !Product_ID) {
            return res.status(400).json({ error: 'User_ID and Product_ID are required' });
          }
        res.status(201).json({message:"show product",data:results})
    } catch (error) {
        console.log(error);
        if (error.code === 'ER_NO_REFERENCED_ROW_2') {
      return res.status(400).json({ error: 'Invalid User_ID or Product_ID' });
    }
        res.status(500).json({ error: "Server Failed" });
    }
}
//delete
const deletetWishlistCtrl = async (req,res) =>{
    try {
        const Product_ID = req.params.id;
        const [results] = await conn.query(wishListQueries.delete,[Product_ID])
        const [showAll] = await conn.query(wishListQueries.showAll);
        res.status(201).json({message:sucMessage.delete,data:showAll})
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: "Server Failed" });
    }
}
//show each  user
const showWishlist = async (req,res)=>{
    try {
        const User_ID = req.user.userId
        const [results] = await conn.query(wishListQueries.showWishlist,[User_ID]);
        if (results.length === 0) {
            return res.status(404).json({ message: "No selected" });
        }
        res.status(200).json({message:"show wishlist",data:results})
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: "Server Failed" });
    }
}
//================orderPage
const showAddressCtrl = async (req,res)=>{
    const User_ID = req.user.userId
    const [result] = await conn.query(addressQueries.show,[User_ID]);
    if (result.length <0) {
        return res.json({message:'no data'})
    }
    res.status(200).json({message:sucMessage.seeAll , data:result})
} 
//address
const insertAddressCtrl = async (req,res)=>{
    const User_ID = req.user.userId
    const {Village,District,Province,Transportation,Branch} = req.body;

    if (!Village || !District || !Province) {
        res.status(400).json({message:errMessage.insert})
    }
    const [result] = await conn.query(addressQueries.insert,[User_ID,Village,District,Province,Transportation,Branch])
    
    res.status(201).json({message:sucMessage.insert,data:result})
}
//checkout 
const checkoutCtrl = async (req,res)=>{
    try {
        const User_ID = req.user.userId;
        
        const {paymentMethode} = req.body
        
        if (!paymentMethode) {
            return res.json({message:'please select payment methode'})
        }
        if(paymentMethode === 'destination'){
           try {
            //shipment
            const Tracking_Number = uuidv4()
            const shipmentData ={
                Tracking_Number,
                Ship_Status:'preparing',
                Ship_Date: new Date()
            }
            const [shipment] = await conn.query(orderQuery.insertShipment,shipmentData);
            //order
            const Shipment_ID = shipment.insertId
             const OID = await 'OID' +rawUuid.replace(/-/g,'').slice(0, 10);
             const Order_Date = new Date()
             const {Address_ID,totalAmount} = req.body;
             const session_id = uuidv4()
             const orderData = {
                 OID,
                 Order_Date,
                 User_ID,
                 Address_ID,
                 Shipment_ID,
                 Order_Status:'completed',
                 Total_Amount:totalAmount,
                 session_id
             } 
            const [order] = await conn.query(orderQuery.insertOrder,orderData)
            const Order_ID = order.insertId;
            console.log(Order_ID);
            
             
             
             const Added_at = new Date()
             const {items} = req.body;
             for(const item of items){
                const {Product_ID,Size,Color,Quantity,Unit_Price,Subtotal} = item
                const rawUuid = uuidv4()
                const CID = await 'CID'+ rawUuid.replace(/-/g,'').slice(0,15)
             const cartData = {
                CID,
                Order_ID,
                User_ID,
                Product_ID,
                Size,
                Color,
                Quantity,
                Unit_Price,
                Subtotal,
                Added_at
             } 
             await conn.query(orderQuery.insertCart,cartData)
             }
             return res.json({message:"success data"})
           } catch (error) {
            console.log(error);
            
           }
        }
    } catch (error) {
        console.log(console.error);
    }
}
module.exports = {
    getProducts,
    getCategories,
    getProductCtrl,
    insertWishlistCtrl,
    deletetWishlistCtrl,
    showWishlist,
    insertAddressCtrl,
    showAddressCtrl,
    checkoutCtrl
};
