const conn = require("../../setting/connection");
const { orderQuery } = require("./query/orderPageQuery");
const { v4: uuidv4 } = require("uuid");
require('dotenv').config();
const { logActivity, ACTIVITY_TYPES } = require('../../service/activityLogger');
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);

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

    // ตรวจสอบ stock ก่อนสร้าง order ทุกครั้ง
    for (const item of items) {
      const { Product_ID, Size, Color, Quantity } = item;
      
      // ตรวจสอบว่าสินค้ามีอยู่จริง
      const [product] = await conn.query(
        orderQuery.checkProduct,
        Product_ID
      );
      if (!product.length) {
        return res.status(404).json({ message: `Product not found: ${Product_ID}` });
      }

      // ตรวจสอบ stock
      const [[stockRow]] = await conn.query(orderQuery.checkStock, [
        Product_ID,
        Size,
        Color,
      ]);

      if (!stockRow || stockRow.Quantity < Quantity) {
        return res.status(400).json({
          message: `Not enough stock for Product ID ${Product_ID}, Color ${Color}, Size ${Size}. Available: ${stockRow ? stockRow.Quantity : 0}, Requested: ${Quantity}`,
        });
      }
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

        // ลด stock หลังจากสร้าง order สำเร็จแล้ว
        for (const item of items) {
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
          success_url: `http://localhost:3000/success.html?id=${OID}`,
          cancel_url: `http://localhost:3000/cancel.html?id=${OID}`,
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

        // ลด stock หลังจากสร้าง order สำเร็จแล้ว (สำหรับ pending orders จะลดใน webhook เมื่อชำระเงินสำเร็จ)
        for (const item of items) {
          await conn.query(orderQuery.deleteStock, [
            item.Quantity,
            item.Product_ID,
            item.Size,
            item.Color,
          ]);
        }

        if (req.user && req.user.userId) {
          const User_ID = req.user.userId
          await logActivity({
            userId: req.user.userId,
            activityType: ACTIVITY_TYPES.ORDER_CREATE,
            description: `created order by user with ID ${User_ID}`,
            relatedId: User_ID,
            ipAddress: req.ip || req.headers['x-forwarded-for'] || req.connection.remoteAddress,
            userAgent: req.headers['user-agent'] || null
          });
        }
        return res.json({
          message: "Stripe session created",
          session_url: session.url,
          session_id :session.id
        });
        
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
    event = stripe.webhooks.constructEvent(req.body, sig,process.env.STRIPE_WEBHOOK_SECRET);


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
    if (req.user && req.user.userId) {
      const User_ID = req.user.userId
    await logActivity({
              userId: req.user.userId,
              activityType: ACTIVITY_TYPES.ORDER_UPDATE,
              description: `payment completed by user with ID ${User_ID}`,
              relatedId: User_ID,
              ipAddress: req.ip || req.headers['x-forwarded-for'] || req.connection.remoteAddress,
              userAgent: req.headers['user-agent'] || null
            });
    }
    res.json({ received: true });
  } catch (error) {
    console.error(' Error processing webhook:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};
// ตรวจสอบสถานะ order
const checkOrderStatus = async (req, res) => {
  try {
    const { orderId } = req.params;
    const User_ID = req.user.userId;

    const [orderResult] = await conn.query(
      `SELECT o.*, p.Payment_Status, p.Payment_Method, s.Ship_Status, s.Tracking_Number 
       FROM orders o 
       LEFT JOIN payments p ON o.Order_ID = p.Order_ID 
       LEFT JOIN shipment s ON o.Shipment_ID = s.Shipment_ID
       WHERE o.OID = ? AND o.User_ID = ?`,
      [orderId, User_ID]
    );

    if (!orderResult.length) {
      return res.status(404).json({ message: "Order not found" });
    }

    const order = orderResult[0];
    
    // แปลงวันที่
    if (order.Order_Date) {
      order.Order_Date = new Date(order.Order_Date).toISOString();
    }
    if (order.created_at) {
      order.created_at = new Date(order.created_at).toISOString();
    }
    if (order.updated_at) {
      order.updated_at = new Date(order.updated_at).toISOString();
    }
    
    // ดึงรายการสินค้าในคำสั่งซื้อ
    const [cartItems] = await conn.query(
      `SELECT c.*, p.Name, p.Brand, p.Image 
       FROM cart c
       LEFT JOIN products p ON c.Product_ID = p.Product_ID
       WHERE c.Order_ID = ?`,
      [order.Order_ID]
    );

    // แปลงวันที่สำหรับ items
    cartItems.forEach(item => {
      if (item.Added_at) {
        item.Added_at = new Date(item.Added_at).toISOString();
      }
    });

    res.json({
      success: true,
      data: {
        order: {
          ...order,
          items: cartItems
        }
      }
    });

  } catch (error) {
    console.error("Check order status error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// จ่ายเงินใหม่สำหรับ pending orders
const repayOrder = async (req, res) => {
  try {
    const { orderId } = req.params;
    const User_ID = req.user.userId;

    // ตรวจสอบ order ที่เป็น pending
    const [orderResult] = await conn.query(
      'SELECT * FROM orders WHERE OID = ? AND User_ID = ? AND Order_Status = "pending"',
      [orderId, User_ID]
    );

    if (!orderResult.length) {
      return res.status(404).json({ message: "Pending order not found" });
    }

    const order = orderResult[0];

    // ดึงรายการสินค้าจาก cart
    const [cartItems] = await conn.query(
      `SELECT c.*, p.Name, p.Description 
       FROM cart c
       LEFT JOIN products p ON c.Product_ID = p.Product_ID
       WHERE c.Order_ID = ?`,
      [order.Order_ID]
    );

    if (!cartItems.length) {
      return res.status(400).json({ message: "No items found in order" });
    }

    // สร้าง line items สำหรับ Stripe
    const lineItems = cartItems.map(item => ({
      price_data: {
        currency: "lak",
        product_data: {
          name: item.Name,
          description: item.Description || '',
        },
        unit_amount: item.Unit_Price * 100,
      },
      quantity: item.Quantity,
    }));

    // สร้าง Stripe session ใหม่
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: lineItems,
      mode: "payment",
      allow_promotion_codes: true,
      success_url: `http://localhost:3000/success.html?id=${orderId}`,
      cancel_url: `http://localhost:3000/cancel.html?id=${orderId}`,
    });

    // อัปเดต session_id ใหม่
    await conn.query(
      'UPDATE orders SET session_id = ?, updated_at = NOW() WHERE Order_ID = ?',
      [session.id, order.Order_ID]
    );

    res.json({
      success: true,
      message: "New payment session created",
      session_url: session.url,
      session_id: session.id
    });

  } catch (error) {
    console.error("Repay order error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// ดึงรายการ orders ของผู้ใช้ พร้อมรายการสินค้า
const getUserOrders = async (req, res) => {
  try {
    const User_ID = req.user.userId;
    const { page = 1, limit = 10 } = req.query;
    const offset = (page - 1) * limit;

    const [orders] = await conn.query(
      `SELECT o.*, p.Payment_Status, p.Payment_Method, s.Ship_Status, s.Tracking_Number, s.Ship_Date
       FROM orders o 
       LEFT JOIN payments p ON o.Order_ID = p.Order_ID 
       LEFT JOIN shipment s ON o.Shipment_ID = s.Shipment_ID
       WHERE o.User_ID = ?
       ORDER BY o.Order_Date DESC
       LIMIT ? OFFSET ?`,
      [User_ID, parseInt(limit), parseInt(offset)]
    );

    // ดึงรายการสินค้าสำหรับแต่ละ order และแปลงวันที่
    for (let order of orders) {
      // แปลงวันที่ให้อยู่ในรูปแบบ ISO string
      if (order.Order_Date) {
        order.Order_Date = new Date(order.Order_Date).toISOString();
      }
      if (order.Ship_Date) {
        order.Ship_Date = new Date(order.Ship_Date).toISOString();
      }
      if (order.created_at) {
        order.created_at = new Date(order.created_at).toISOString();
      }
      if (order.updated_at) {
        order.updated_at = new Date(order.updated_at).toISOString();
      }

      const [items] = await conn.query(
        `SELECT c.*, p.Name, p.Brand, p.Image, p.Description
         FROM cart c
         LEFT JOIN products p ON c.Product_ID = p.Product_ID
         WHERE c.Order_ID = ?
         ORDER BY c.Added_at DESC`,
        [order.Order_ID]
      );
      
      // แปลงวันที่สำหรับ items ด้วย
      items.forEach(item => {
        if (item.Added_at) {
          item.Added_at = new Date(item.Added_at).toISOString();
        }
      });
      
      order.items = items;
    }

    // นับจำนวน orders ทั้งหมด
    const [countResult] = await conn.query(
      'SELECT COUNT(*) as total FROM orders WHERE User_ID = ?',
      [User_ID]
    );

    res.json({
      success: true,
      data: {
        orders,
        pagination: {
          currentPage: parseInt(page),
          totalPages: Math.ceil(countResult[0].total / limit),
          totalOrders: countResult[0].total
        }
      }
    });

  } catch (error) {
    console.error("Get user orders error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// ยกเลิก order (สำหรับ pending orders หรือ destination orders ที่ยังไม่ได้ส่ง)
const cancelOrder = async (req, res) => {
  try {
    const { orderId } = req.params;
    const User_ID = req.user.userId;

    // ตรวจสอบ order ที่สามารถยกเลิกได้
    const [orderResult] = await conn.query(
      `SELECT o.*, p.Payment_Method, s.Ship_Status 
       FROM orders o 
       LEFT JOIN payments p ON o.Order_ID = p.Order_ID 
       LEFT JOIN shipment s ON o.Shipment_ID = s.Shipment_ID
       WHERE o.OID = ? AND o.User_ID = ? 
       AND (o.Order_Status = "pending" 
            OR (o.Order_Status = "completed" 
                AND p.Payment_Method = "on delivery" 
                AND s.Ship_Status = "preparing"))`,
      [orderId, User_ID]
    );

    if (!orderResult.length) {
      return res.status(404).json({ 
        message: "Order not found or cannot be cancelled. Only pending orders or COD orders that haven't been shipped can be cancelled." 
      });
    }

    const order = orderResult[0];

    // คืนสต็อกสินค้า
    const [cartItems] = await conn.query(
      'SELECT Product_ID, Quantity, Size, Color FROM cart WHERE Order_ID = ?',
      [order.Order_ID]
    );

    for (const item of cartItems) {
      // เพิ่มสต็อกกลับเข้าไป
      await conn.query(
        `UPDATE inventory SET Quantity = Quantity + ? 
         WHERE Product_ID = ? AND Size = ? AND Color = ?`,
        [item.Quantity, item.Product_ID, item.Size, item.Color]
      );
    }

    // อัปเดตสถานะ order เป็น cancelled
    await conn.query(
      'UPDATE orders SET Order_Status = "cancelled", updated_at = NOW() WHERE Order_ID = ?',
      [order.Order_ID]
    );

    // อัปเดตสถานะ shipment เป็น cancelled
    if (order.Shipment_ID) {
      await conn.query(
        'UPDATE shipment SET Ship_Status = "cancelled" WHERE Shipment_ID = ?',
        [order.Shipment_ID]
      );
    }

        if (req.user && req.user.userId) {
      const User_ID = req.user.userId
    await logActivity({
              userId: req.user.userId,
              activityType: ACTIVITY_TYPES.ORDER_CANCEL,
              description: `cancel order by user with ID ${User_ID}`,
              relatedId: User_ID,
              ipAddress: req.ip || req.headers['x-forwarded-for'] || req.connection.remoteAddress,
              userAgent: req.headers['user-agent'] || null
            });
    }

    res.json({
      success: true,
      message: "Order cancelled successfully"
    });

  } catch (error) {
    console.error("Cancel order error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// ดึงสถานะ timeline ของการขนส่ง
const getShippingTimeline = async (req, res) => {
  try {
    const { orderId } = req.params;
    const User_ID = req.user.userId;

    const [orderResult] = await conn.query(
      `SELECT o.*, s.Ship_Status, s.Tracking_Number, s.Ship_Date
       FROM orders o 
       LEFT JOIN shipment s ON o.Shipment_ID = s.Shipment_ID
       WHERE o.OID = ? AND o.User_ID = ?`,
      [orderId, User_ID]
    );

    if (!orderResult.length) {
      return res.status(404).json({ message: "Order not found" });
    }

    const order = orderResult[0];
    
    // แปลงวันที่ก่อนส่งใน timeline
    if (order.Order_Date) {
      order.Order_Date = new Date(order.Order_Date).toISOString();
    }
    if (order.Ship_Date) {
      order.Ship_Date = new Date(order.Ship_Date).toISOString();
    }
    if (order.updated_at) {
      order.updated_at = new Date(order.updated_at).toISOString();
    }
    
    // สร้าง timeline ตามสถานะ order และ shipment
    const timeline = [];
    
    // สถานะการสั่งซื้อ
    timeline.push({
      status: "ordered",
      title: "ການສັ່ງຊື້ຖືກສ້າງ",
      description: `ລະຫັດການສັ່ງຊື້: ${order.OID}`,
      timestamp: order.Order_Date,
      completed: true,
      icon: "shopping_cart"
    });

    // สถานะการชำระเงิน
    if (order.Order_Status === "completed") {
      timeline.push({
        status: "paid",
        title: "ຈ່າຍເງິນແລ້ວ",
        description: "ໄດ້ຮັບການຈ່າຍເງິນແລ້ວ",
        timestamp: order.Order_Date,
        completed: true,
        icon: "payment"
      });
    } else if (order.Order_Status === "pending") {
      timeline.push({
        status: "pending_payment",
        title: "ລໍຖ້າການຈ່າຍເງິນ",
        description: "ກະລຸນາຈ່າຍເງິນເພື່ອດໍາເນີນການຕໍ່",
        timestamp: null,
        completed: false,
        icon: "schedule"
      });
    } else if (order.Order_Status === "cancelled") {
      timeline.push({
        status: "cancelled",
        title: "ການສັ່ງຊື້ຖືກຍົກເລີກ",
        description: "ການສັ່ງຊື້ນີ້ຖືກຍົກເລີກແລ້ວ",
        timestamp: order.updated_at || order.Order_Date,
        completed: true,
        icon: "cancel",
        isError: true
      });
      
      return res.json({
        success: true,
        data: { timeline }
      });
    }

    // สถานะการจัดส่ง
    if (order.Ship_Status) {
      switch (order.Ship_Status) {
        case "preparing":
          timeline.push({
            status: "preparing",
            title: "ກໍາລັງກະກຽມສິນຄ້າ",
            description: "ພວກເຮົາກໍາລັງກະກຽມສິນຄ້າຂອງທ່ານ",
            timestamp: order.Ship_Date,
            completed: true,
            icon: "inventory"
          });
          timeline.push({
            status: "shipping",
            title: "ກໍາລັງຈັດສົ່ງ",
            description: `ຫມາຍເລກຕິດຕາມ: ${order.Tracking_Number || 'ກໍາລັງອອກຫມາຍເລກ'}`,
            timestamp: null,
            completed: false,
            icon: "local_shipping"
          });
          break;
          
        case "shipped":
          timeline.push({
            status: "preparing",
            title: "ກໍາລັງກະກຽມສິນຄ້າ",
            description: "ກະກຽມສິນຄ້າເຮັດແລ້ວ",
            timestamp: order.Ship_Date,
            completed: true,
            icon: "inventory"
          });
          timeline.push({
            status: "shipping",
            title: "ກໍາລັງຈັດສົ່ງ",
            description: `ຫມາຍເລກຕິດຕາມ: ${order.Tracking_Number}`,
            timestamp: order.Ship_Date,
            completed: true,
            icon: "local_shipping"
          });
          timeline.push({
            status: "delivered",
            title: "ຈັດສົ່ງແລ້ວ",
            description: "ສິນຄ້າຮອດທີ່ໝາຍແລ້ວ",
            timestamp: null,
            completed: false,
            icon: "check_circle"
          });
          break;
          
        case "delivered":
          timeline.push({
            status: "preparing",
            title: "ກະກຽມສິນຄ້າ",
            description: "ກະກຽມສິນຄ້າເຮັດແລ້ວ",
            timestamp: order.Ship_Date,
            completed: true,
            icon: "inventory"
          });
          timeline.push({
            status: "shipping",
            title: "ຈັດສົ່ງແລ້ວ",
            description: `ຫມາຍເລກຕິດຕາມ: ${order.Tracking_Number}`,
            timestamp: order.Ship_Date,
            completed: true,
            icon: "local_shipping"
          });
                     timeline.push({
             status: "delivered",
             title: "ຈັດສົ່ງແລ້ວ",
             description: "ສິນຄ້າຮອດທີ່ໝາຍແລ້ວ",
             timestamp: new Date().toISOString(), // ใช้เวลาปัจจุบันหากไม่มีข้อมูล
             completed: true,
             icon: "check_circle"
           });
          break;
          
        case "cancelled":
          timeline.push({
            status: "cancelled",
            title: "ການຈັດສົ່ງຖືກຍົກເລີກ",
            description: "ການຈັດສົ່ງຖືກຍົກເລີກ",
            timestamp: order.Ship_Date,
            completed: true,
            icon: "cancel",
            isError: true
          });
          break;
      }
    }
    res.json({
      success: true,
      data: { 
        timeline,
        order: {
          oid: order.OID,
          status: order.Order_Status,
          ship_status: order.Ship_Status,
          tracking_number: order.Tracking_Number
        }
      }
    });

  } catch (error) {
    console.error("Get shipping timeline error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

module.exports = {
  checkoutCtrl,
  webhookCtrl,
  checkOrderStatus,
  repayOrder,
  getUserOrders,
  cancelOrder,
  getShippingTimeline
};
