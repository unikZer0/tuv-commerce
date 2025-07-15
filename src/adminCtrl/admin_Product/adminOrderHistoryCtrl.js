// Order History Controller for Admin Panel
const conn = require('../../setting/connection');
const { sucMessage, errMessage } = require('../../service/messages');
const { logActivity, ACTIVITY_TYPES } = require('../../service/activityLogger');

// Get all orders with detailed information
const getAllOrdersCtrl = async (req, res) => {
  try {
    const { page = 1, limit = 10, status, startDate, endDate, userId } = req.query;
    const offset = (page - 1) * limit;

    let whereConditions = [];
    let queryParams = [];

    // Build WHERE conditions based on filters
    if (status) {
      whereConditions.push('o.Order_Status = ?');
      queryParams.push(status);
    }

    if (startDate && endDate) {
      whereConditions.push('o.Order_Date BETWEEN ? AND ?');
      queryParams.push(startDate, endDate);
    } else if (startDate) {
      whereConditions.push('o.Order_Date >= ?');
      queryParams.push(startDate);
    } else if (endDate) {
      whereConditions.push('o.Order_Date <= ?');
      queryParams.push(endDate);
    }

    if (userId) {
      whereConditions.push('o.User_ID = ?');
      queryParams.push(userId);
    }

    const whereClause = whereConditions.length > 0 ? 'WHERE ' + whereConditions.join(' AND ') : '';

    // Main query to get orders with user and address information
    const mainQuery = `
      SELECT 
        o.Order_ID,
        o.OID,
        o.Order_Date,
        o.Order_Status,
        o.Total_Amount,
        o.session_id,
        o.created_at,
        o.updated_at,
        u.User_ID,
        u.FirstName,
        u.LastName,
        u.Email,
        u.Phone,
        a.Village,
        a.District,
        a.Province,
        a.Transportation,
        a.Branch,
        s.Tracking_Number,
        s.Ship_Status,
        s.Ship_Date,
        p.Payment_Status,
        p.Payment_Method,
        p.Amount as Payment_Amount
      FROM orders o
      LEFT JOIN users u ON o.User_ID = u.User_ID
      LEFT JOIN address a ON o.Address_ID = a.Address_ID
      LEFT JOIN shipment s ON o.Shipment_ID = s.Shipment_ID
      LEFT JOIN payments p ON o.Order_ID = p.Order_ID
      ${whereClause}
      ORDER BY o.Order_Date DESC
      LIMIT ? OFFSET ?
    `;

    // Count query for pagination
    const countQuery = `
      SELECT COUNT(*) as total
      FROM orders o
      LEFT JOIN users u ON o.User_ID = u.User_ID
      ${whereClause}
    `;

    // Execute queries
    const [orders] = await conn.query(mainQuery, [...queryParams, parseInt(limit), offset]);
    const [countResult] = await conn.query(countQuery, queryParams);
    const totalOrders = countResult[0].total;

    // Get order items for each order
    for (let order of orders) {
      const [orderItems] = await conn.query(`
        SELECT 
          c.Cart_ID,
          c.Size,
          c.Color,
          c.Quantity,
          c.Unit_Price,
          c.Subtotal,
          p.Product_ID,
          p.Name as Product_Name,
          p.Brand,
          p.Image as Product_Image
        FROM cart c
        LEFT JOIN products p ON c.Product_ID = p.Product_ID
        WHERE c.Order_ID = ?
      `, [order.Order_ID]);
      
      order.items = orderItems;
    }

    // Log activity
    if (req.user && req.user.userId) {
      await logActivity({
        userId: req.user.userId,
        activityType: ACTIVITY_TYPES.ORDER_VIEW,
        description: `Viewed order history by admin`,
        relatedId: req.user.userId,
        ipAddress: req.ip || req.headers['x-forwarded-for'] || req.connection.remoteAddress,
        userAgent: req.headers['user-agent'] || null
      });
    }

    return res.status(200).json({
      message: "ດຶງຂໍ້ມູນປະຫວັດການສັ່ງຊື້ສຳເລັດ",
      data: orders,
      pagination: {
        currentPage: parseInt(page),
        totalPages: Math.ceil(totalOrders / limit),
        totalOrders,
        limit: parseInt(limit)
      }
    });

  } catch (error) {
    console.error("Get all orders error:", error);
    return res.status(500).json({ message: errMessage.server });
  }
};

// Get order by ID with detailed information
const getOrderByIdCtrl = async (req, res) => {
  try {
    const { id } = req.params;

    if (!id) {
      return res.status(400).json({ message: "ກະລຸນາລະບຸລະຫັດການສັ່ງຊື້" });
    }

    // Get order details
    const [orderResult] = await conn.query(`
      SELECT 
        o.Order_ID,
        o.OID,
        o.Order_Date,
        o.Order_Status,
        o.Total_Amount,
        o.session_id,
        o.created_at,
        o.updated_at,
        u.User_ID,
        u.FirstName,
        u.LastName,
        u.Email,
        u.Phone,
        a.Address_ID,
        a.Village,
        a.District,
        a.Province,
        a.Transportation,
        a.Branch,
        s.Shipment_ID,
        s.Tracking_Number,
        s.Ship_Status,
        s.Ship_Date,
        p.Payment_ID,
        p.Payment_Status,
        p.Payment_Method,
        p.Amount as Payment_Amount,
        p.Currency,
        p.Payment_Intent_ID
      FROM orders o
      LEFT JOIN users u ON o.User_ID = u.User_ID
      LEFT JOIN address a ON o.Address_ID = a.Address_ID
      LEFT JOIN shipment s ON o.Shipment_ID = s.Shipment_ID
      LEFT JOIN payments p ON o.Order_ID = p.Order_ID
      WHERE o.Order_ID = ?
    `, [id]);

    if (orderResult.length === 0) {
      return res.status(404).json({ message: "ບໍ່ພົບການສັ່ງຊື້" });
    }

    const order = orderResult[0];

    // Get order items
    const [orderItems] = await conn.query(`
      SELECT 
        c.Cart_ID,
        c.Size,
        c.Color,
        c.Quantity,
        c.Unit_Price,
        c.Subtotal,
        p.Product_ID,
        p.Name as Product_Name,
        p.Brand,
        p.Image as Product_Image,
        pt.productType_Name as Product_Type
      FROM cart c
      LEFT JOIN products p ON c.Product_ID = p.Product_ID
      LEFT JOIN product_types pt ON p.productType_ID = pt.productType_ID
      WHERE c.Order_ID = ?
    `, [id]);

    order.items = orderItems;

    // Log activity
    if (req.user && req.user.userId) {
      await logActivity({
        userId: req.user.userId,
        activityType: ACTIVITY_TYPES.ORDER_VIEW,
        description: `Viewed order details for order ID ${id}`,
        relatedId: parseInt(id),
        ipAddress: req.ip || req.headers['x-forwarded-for'] || req.connection.remoteAddress,
        userAgent: req.headers['user-agent'] || null
      });
    }

    return res.status(200).json({
      message: "ດຶງຂໍ້ມູນການສັ່ງຊື້ສຳເລັດ",
      data: order
    });

  } catch (error) {
    console.error("Get order by ID error:", error);
    return res.status(500).json({ message: errMessage.server });
  }
};

// Get order statistics
const getOrderStatsCtrl = async (req, res) => {
  try {
    const { startDate, endDate } = req.query;

    let dateFilter = '';
    let queryParams = [];

    if (startDate && endDate) {
      dateFilter = 'WHERE Order_Date BETWEEN ? AND ?';
      queryParams = [startDate, endDate];
    } else if (startDate) {
      dateFilter = 'WHERE Order_Date >= ?';
      queryParams = [startDate];
    } else if (endDate) {
      dateFilter = 'WHERE Order_Date <= ?';
      queryParams = [endDate];
    }

    // Get order statistics
    const [statsResult] = await conn.query(`
      SELECT 
        COUNT(*) as totalOrders,
        SUM(CASE WHEN Order_Status = 'completed' THEN 1 ELSE 0 END) as completedOrders,
        SUM(CASE WHEN Order_Status = 'pending' THEN 1 ELSE 0 END) as pendingOrders,
        SUM(CASE WHEN Order_Status = 'cancelled' THEN 1 ELSE 0 END) as cancelledOrders,
        SUM(Total_Amount) as totalRevenue,
        AVG(Total_Amount) as averageOrderValue
      FROM orders
      ${dateFilter}
    `, queryParams);

    // Get monthly order trends
    const [monthlyTrends] = await conn.query(`
      SELECT 
        DATE_FORMAT(Order_Date, '%Y-%m') as month,
        COUNT(*) as orderCount,
        SUM(Total_Amount) as monthlyRevenue
      FROM orders
      ${dateFilter}
      GROUP BY DATE_FORMAT(Order_Date, '%Y-%m')
      ORDER BY month DESC
      LIMIT 12
    `, queryParams);

    // Get top selling products
    const [topProducts] = await conn.query(`
      SELECT 
        p.Product_ID,
        p.Name as Product_Name,
        p.Brand,
        COUNT(c.Cart_ID) as timesOrdered,
        SUM(c.Quantity) as totalQuantitySold,
        SUM(c.Subtotal) as totalRevenue
      FROM cart c
      LEFT JOIN products p ON c.Product_ID = p.Product_ID
      LEFT JOIN orders o ON c.Order_ID = o.Order_ID
      ${dateFilter ? dateFilter.replace('Order_Date', 'o.Order_Date') : ''}
      GROUP BY p.Product_ID, p.Name, p.Brand
      ORDER BY totalQuantitySold DESC
      LIMIT 10
    `, queryParams);

    const stats = {
      ...statsResult[0],
      monthlyTrends,
      topProducts
    };

    return res.status(200).json({
      message: "ດຶງຂໍ້ມູນສະຖິຕິການສັ່ງຊື້ສຳເລັດ",
      data: stats
    });

  } catch (error) {
    console.error("Get order stats error:", error);
    return res.status(500).json({ message: errMessage.server });
  }
};

// Update order status
const updateOrderStatusCtrl = async (req, res) => {
  try {
    const { id } = req.params;
    const { Order_Status } = req.body;

    if (!id || !Order_Status) {
      return res.status(400).json({ message: "ກະລຸນາລະບຸລະຫັດການສັ່ງຊື້ ແລະ ສະຖານະ" });
    }

    // Valid order statuses
    const validStatuses = ['pending', 'processing', 'shipped', 'delivered', 'completed', 'cancelled'];
    if (!validStatuses.includes(Order_Status)) {
      return res.status(400).json({ message: "ສະຖານະການສັ່ງຊື້ບໍ່ຖືກຕ້ອງ" });
    }

    // Check if order exists
    const [checkResult] = await conn.query(
      "SELECT COUNT(*) AS count FROM orders WHERE Order_ID = ?",
      [id]
    );

    if (checkResult[0].count === 0) {
      return res.status(404).json({ message: "ບໍ່ພົບການສັ່ງຊື້" });
    }

    // Update order status
    await conn.query(
      "UPDATE orders SET Order_Status = ?, updated_at = CURRENT_TIMESTAMP WHERE Order_ID = ?",
      [Order_Status, id]
    );

    // Log activity
    if (req.user && req.user.userId) {
      await logActivity({
        userId: req.user.userId,
        activityType: ACTIVITY_TYPES.ORDER_UPDATE,
        description: `Updated order status to ${Order_Status} for order ID ${id}`,
        relatedId: parseInt(id),
        ipAddress: req.ip || req.headers['x-forwarded-for'] || req.connection.remoteAddress,
        userAgent: req.headers['user-agent'] || null
      });
    }

    return res.status(200).json({ 
      message: "ອັບເດດສະຖານະການສັ່ງຊື້ສຳເລັດ" 
    });

  } catch (error) {
    console.error("Update order status error:", error);
    return res.status(500).json({ message: errMessage.server });
  }
};

// Get orders by user ID
const getOrdersByUserIdCtrl = async (req, res) => {
  try {
    const { userId } = req.params;
    const { page = 1, limit = 10 } = req.query;
    const offset = (page - 1) * limit;

    if (!userId) {
      return res.status(400).json({ message: "ກະລຸນາລະບຸລະຫັດຜູ້ໃຊ້" });
    }

    // Check if user exists
    const [userCheck] = await conn.query(
      "SELECT COUNT(*) AS count FROM users WHERE User_ID = ?",
      [userId]
    );

    if (userCheck[0].count === 0) {
      return res.status(404).json({ message: "ບໍ່ພົບຜູ້ໃຊ້" });
    }

    // Get orders for specific user
    const [orders] = await conn.query(`
      SELECT 
        o.Order_ID,
        o.OID,
        o.Order_Date,
        o.Order_Status,
        o.Total_Amount,
        o.session_id,
        o.created_at,
        o.updated_at,
        s.Tracking_Number,
        s.Ship_Status,
        s.Ship_Date,
        p.Payment_Status,
        p.Payment_Method,
        p.Amount as Payment_Amount
      FROM orders o
      LEFT JOIN shipment s ON o.Shipment_ID = s.Shipment_ID
      LEFT JOIN payments p ON o.Order_ID = p.Order_ID
      WHERE o.User_ID = ?
      ORDER BY o.Order_Date DESC
      LIMIT ? OFFSET ?
    `, [userId, parseInt(limit), offset]);

    // Get total count for pagination
    const [countResult] = await conn.query(
      "SELECT COUNT(*) as total FROM orders WHERE User_ID = ?",
      [userId]
    );

    return res.status(200).json({
      message: "ດຶງຂໍ້ມູນການສັ່ງຊື້ຂອງຜູ້ໃຊ້ສຳເລັດ",
      data: orders,
      pagination: {
        currentPage: parseInt(page),
        totalPages: Math.ceil(countResult[0].total / limit),
        totalOrders: countResult[0].total,
        limit: parseInt(limit)
      }
    });

  } catch (error) {
    console.error("Get orders by user ID error:", error);
    return res.status(500).json({ message: errMessage.server });
  }
};

module.exports = {
  getAllOrdersCtrl,
  getOrderByIdCtrl,
  getOrderStatsCtrl,
  updateOrderStatusCtrl,
  getOrdersByUserIdCtrl
}; 
