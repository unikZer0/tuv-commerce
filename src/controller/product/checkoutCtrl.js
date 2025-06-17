const conn = require("../../setting/connection");
const { orderQuery } = require("./query/orderPageQuery");
const { v4: uuidv4 } = require("uuid");
require('dotenv').config();
const stripe = require("stripe")('sk_test_51RQ0e44c05uxt3S1YswQ1jP45uwZedHiuUaAlYYLQHoEdYvvvdphhP6jEC1KTfQps0Y7SqDIdZuhNB6JWHXT3GnC00btevvoXQ');

//checkout
const checkoutCtrl = async (req, res) => {
  try {
    const User_ID = req.user.userId;

    const { Address_ID, totalAmount, items, paymentMethode } = req.body;

    if (!Address_ID || !totalAmount || !items || !Array.isArray(items)) {
      return res.status(400).json({ message: "Missing required fields" });
    }
    if (!paymentMethode) {
      return res.json({ message: "please select payment methode" });
    }
    if (paymentMethode === "destination") {
      try {
        //shipment
        const Tracking_Number = uuidv4().slice(0, 10);
        const shipmentData = {
          Tracking_Number,
          Ship_Status: "preparing",
          Ship_Date: new Date(),
        };
        const [shipment] = await conn.query(
          orderQuery.insertShipment,
          shipmentData
        );
        //order
        const Shipment_ID = shipment.insertId;
        const rawUuid = uuidv4();
        const OID = (await "OID") + rawUuid.replace(/-/g, "").slice(0, 10);
        const Order_Date = new Date();
        const session_id = uuidv4();
        const orderData = {
          OID,
          Order_Date,
          User_ID,
          Address_ID,
          Shipment_ID,
          Order_Status: "completed",
          Total_Amount: totalAmount ,
          session_id,
        };
        await conn.query(orderQuery.actualAmount,totalAmount)
        const [order] = await conn.query(orderQuery.insertOrder, orderData);
        const Order_ID = order.insertId;
        const payment_id = uuidv4().replace(/-/g, "").slice(0, 15);
        const paymentData = {
          Payment_ID: payment_id,
          Order_ID,
          Payment_Status: 'paid',
          Payment_Method: 'on delivery',
          Amount: totalAmount *100,
          Currency: 'lak',
          Payment_Intent_ID: uuidv4().slice(0, 10)
        };

        await conn.query('INSERT INTO payments SET ?', paymentData);
        console.log(Order_ID);
        const Added_at = new Date();
        const { items } = req.body;
        console.log(items);
        
        for (const item of items) {
          const { Product_ID, Size, Color, Quantity, Unit_Price, Subtotal } =
            item;
          const rawUuid = uuidv4();
          const CID = (await "CID") + rawUuid.replace(/-/g, "").slice(0, 15);
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
            Added_at,
          };
          await conn.query(orderQuery.insertCart, cartData);
        }
        const [carts] = await conn.query(orderQuery.callToDelete, Order_ID);
        for (const item of carts) {
          const [[stockRow]] = await conn.query(orderQuery.checkStock, [
            item.Product_ID,
            item.Size,
            item.Color,
          ]);

          if (!stockRow || stockRow.Quantity < item.Quantity) {
            return res.status(400).json({
              message: `Not enough stock for Product ID ${item.Product_ID}, Color ${item.Color}, Size ${item.Size}`,
            });
          }
          await conn.query(orderQuery.deleteStock, [
            item.Quantity,
            item.Product_ID,
            item.Size,
            item.Color,
          ]);
        }
        return res.json({ message: "success data",data:orderData });
      } catch (error) {
        console.log(error);
      }
    }
    if (paymentMethode === "card") {
      try {
        const lineItems = [];

        for (const item of items) {
          const [product] = await conn.query(
            orderQuery.checkProduct,
            item.Product_ID
          );
          if (!product.length) {
            return res.status(404).json({ message: "Product not found" });
          }
          lineItems.push({
            price_data: {
              currency: "lak",
              product_data: {
                name: product[0].Name,
                description: product[0].Description,
              },
              unit_amount: item.Unit_Price *100,
            },
            quantity: item.Quantity,
          });      
          
          
        }
        const Order_Date = new Date();
        const rawUuid = uuidv4();
        const OID = "OID" + rawUuid.replace(/-/g, "").slice(0, 10);
        console.log("hi  :",lineItems);
        if (!lineItems.length) {
              return res.status(400).json({ message: "No valid products found in cart" });
            }
        const session = await stripe.checkout.sessions.create({
          payment_method_types: ["card"],
          line_items: lineItems,
          mode: "payment",
          allow_promotion_codes: true,
          success_url: `http://localhost:8888/success.html?id=${OID}`,
          cancel_url: `http://localhost:8888/cancel.html?id=${OID}`,
        });
        const Tracking_Number = uuidv4().slice(0, 10);
        const shipmentData = {
          Tracking_Number,
          Ship_Status: "preparing",
          Ship_Date: new Date(),
        };

        if (!orderQuery.insertShipment) {
          throw new Error("orderQuery.insertShipment is undefined");
        }

        const [shipment] = await conn.query(
          orderQuery.insertShipment,
          shipmentData
        );
        const Shipment_ID = shipment.insertId;
        const orderData = {
          OID,
          Order_Date,
          User_ID,
          Address_ID,
          Shipment_ID,
          Order_Status: "pending",
          Total_Amount: totalAmount,
          session_id: session.id,
        };

        if (!orderQuery.insertOrder) {
          throw new Error("orderQuery.insertOrder is undefined");
        }
        await conn.query(orderQuery.actualAmount,totalAmount)
        const [order] = await conn.query(orderQuery.insertOrder, orderData);
        const Order_ID = order.insertId;

        const Added_at = new Date();

        for (const item of items) {
          const { Product_ID, Size, Color, Quantity, Unit_Price, Subtotal } =
            item;
          const CID = "CID" + uuidv4().replace(/-/g, "").slice(0, 15);
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
            Added_at,
          };

          if (!orderQuery.insertCart) {
            throw new Error("orderQuery.insertCart is undefined");
          }

          await conn.query(orderQuery.insertCart, cartData);
        }
        const [carts] = await conn.query(orderQuery.callToDelete, Order_ID);
        for (const item of carts) {
          
          const [[stockRow]] = await conn.query(orderQuery.checkStock, [
            item.Product_ID,
            item.Size,
            item.Color,
          ]);

          if (!stockRow || stockRow.Quantity < item.Quantity) {
            return res.status(400).json({
              message: `Not enough stock for Product ID ${item.Product_ID}, Color ${item.Color}, Size ${item.Size}`,
            });
          }
          await conn.query(orderQuery.deleteStock, [
            item.Quantity,
            item.Product_ID,
            item.Size,
            item.Color,
          ]);
            return res.json({
          message: "Stripe session created",
          session_url: session.url,
          session_id :session.id
          });
          
          
        }
        
      } catch (error) {
        console.error("Stripe/card checkout error:", error);
        return res.status(500).json({ message: "Internal server error" });
      }
    }
  } catch (error) {
    console.log(console.error);
  }
};
const webhookCtrl = async (req,res)=>{

  const sig = req.headers['stripe-signature'];
  let event;

  try {
    event = stripe.webhooks.constructEvent(req.body, sig,'whsec_04a8cfa28f692e67745d72973e0a4ce92bb04db24a6bea6b5df0e4eee93f969d');


  } catch (err) {
    console.error('Webhook Error:', err.message);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  try {
    switch (event.type) {
      case 'checkout.session.completed':
        const session = event.data.object;
        const orderUpdate = {
          Order_Status: 'completed',
          Updated_At: new Date()
        };

        await conn.query('UPDATE orders SET ? WHERE session_id = ?', [orderUpdate, session.id]);
        const [orderResult] = await conn.query('SELECT Order_ID FROM orders WHERE session_id = ?', [session.id]);
        const Order_ID = orderResult.length ? orderResult[0].Order_ID : null;
        if (!Order_ID) {
          console.error('Order not found for session_id:', session.id);
          return res.status(404).send('Order not found');
        }

        const paymentData = {
          Payment_ID: session.payment_intent,
          Order_ID,
          Payment_Status: session.payment_status,
          Payment_Method: session.payment_method_types[0],
          Amount: session.amount_total ,
          Currency: session.currency,
          Payment_Intent_ID: session.payment_intent
        };

        await conn.query('INSERT INTO payments SET ?', paymentData);

        const [cartItems] = await conn.query('SELECT Product_ID, Quantity, Size, Color FROM cart WHERE Order_ID = ?', [Order_ID]);

        for (const item of cartItems) {
          await conn.query(orderQuery.deleteStock, [item.Quantity, item.Product_ID, item.Size, item.Color]);
        }

        let promo_code_id = null;
        let promo_code_str = null;

        if (
          session.total_details?.amount_discount > 0 &&
          session.discounts?.length > 0
        ) {
          promo_code_id = session.discounts[0].promotion_code;
          if (promo_code_id) {
            const promo = await stripe.promotionCodes.retrieve(promo_code_id);
            promo_code_str = promo.code;
          }
        }

        const discountAmount = session.total_details?.amount_discount
          ? session.total_details.amount_discount / 100
          : 0;

        if (promo_code_id && promo_code_str) {
          const [userRow] = await conn.query('SELECT User_ID FROM orders WHERE Order_ID = ?', [Order_ID]);
          const User_ID = userRow.length ? userRow[0].User_ID : null;

          if (User_ID) {
            await conn.query(
              'INSERT INTO promotion_code_usages (User_ID, Order_ID, Payment_ID, Promo_Code_ID, Promo_Code, Discount_Amount) VALUES (?, ?, ?, ?, ?, ?)',
              [User_ID, Order_ID, session.payment_intent, promo_code_id, promo_code_str, discountAmount]
            );
          }
        }

        console.log('Stripe order completed and updated:', Order_ID);
        break;

      default:
        console.log(`Unhandled event type: ${event.type}`);
    }

    res.json({ received: true });
  } catch (error) {
    console.error(' Error processing webhook:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};
module.exports = {
  checkoutCtrl,
  webhookCtrl
};
