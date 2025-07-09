// ProductController.js
const conn = require('../../setting/connection');
const { productQueries } = require('./ProductQueries');
const { sucMessage, errMessage } = require('../../service/messages');
const { v4: uuidv4 } = require("uuid");
const { logActivity, ACTIVITY_TYPES } = require('../../service/activityLogger');
const rawUuid = uuidv4();
const bodyParser = require('body-parser');

const getAllProductsCtrl = async (req, res) => {
  try {
    const [results] = await conn.query(productQueries.getAllProducts);
    return res.status(200).json({
      message: sucMessage.seeAll,
      data: results,
    });
  } catch (error) {
    console.error("products error:", error);
    return res.status(500).json({ message: errMessage.server });
  }
};

const createProductCtrl = async (req, res) => {
  let connection;
  try {
    connection = await conn.getConnection();
    await connection.beginTransaction();

    const rawUuid = uuidv4();
    const PID = 'PID' + rawUuid.replace(/-/g, '').substring(0, 13);
    
    const { 
      Name, 
      Brand, 
      Price, 
      Description, 
      Status, 
      Image, 
      productType_ID, 
      Added_By,
      inventory = [] // Array of inventory items
    } = req.body;

    // ตรวจสอบข้อมูลที่จำเป็น
    if (!PID || !Name || !Price || !productType_ID) {
      await connection.rollback();
      return res.status(400).json({ message: errMessage.invalidData });
    }

    // ตรวจสอบ Price range (decimal(10,2) = max 99,999,999.99)
    const price = parseFloat(Price);
    if (isNaN(price) || price < 10000) {
      await connection.rollback();
      return res.status(400).json({ message: "ລາຄາຂັ້ນຕ່ຳທີ່ອະນຸຍາດ: 10,000 ກີບ" });
    }
    if (price > 99999999.99) {
      await connection.rollback();
      return res.status(400).json({ message: "ລາຄາສູງສຸດທີ່ອະນຸຍາດ: 99,999,999.99 ກີບ" });
    }

    // เพิ่มสินค้า
    const [productResult] = await connection.query(productQueries.insertProduct, [
      PID, Name, Brand, Price, Description, Status, Image, productType_ID, Added_By
    ]);

    const productId = productResult.insertId;

    if (inventory && inventory.length > 0) {
      for (const item of inventory) {
        const { Size, Color, Quantity } = item;
        if (Size && Color && Quantity !== undefined && Quantity >= 0) {
          await connection.query(productQueries.insertInventory, [
            productId, Size, Color, Quantity
          ]);
        } else {
          console.log("Skipping invalid inventory item:", item); // Debug log
        }
      }
    } else {
      console.log("No inventory items to process"); // Debug log
    }

    await connection.commit();
    if (req.user && req.user.userId) {
      const User_ID = req.user.userId
    await logActivity({
              userId: req.user.userId,
              activityType: ACTIVITY_TYPES.PRODUCT_CREATE,
              description: `created by user with ID ${User_ID}`,
              relatedId: User_ID,
              ipAddress: req.ip || req.headers['x-forwarded-for'] || req.connection.remoteAddress,
              userAgent: req.headers['user-agent'] || null
            });
    }
    return res.status(201).json({
      message: sucMessage.created,
      data: { Product_ID: productId }
    });
  } catch (error) {
    if (connection) {
      await connection.rollback();
    }
    console.error("create product error:", error);

    if (error.code === 'ER_DUP_ENTRY') {
      return res.status(409).json({ message: errMessage.duplicate });
    }

    return res.status(500).json({ message: errMessage.server });
  } finally {
    if (connection) {
      connection.release();
    }
  }
};

// ดึงข้อมูลสินค้าตาม ID พร้อม inventory
const getProductByIdCtrl = async (req, res) => {
  try {
    const { id } = req.params;
    
    if (!id) {
      return res.status(400).json({ message: "ກະລຸນາລະບຸລະຫັດສິນຄ້າ" });
    }

    const [productResult] = await conn.query(productQueries.getProductById, [id]);
    const [inventoryResult] = await conn.query(productQueries.getInventoryByProductId, [id]);

    if (productResult.length === 0) {
      return res.status(404).json({ message: "ບໍ່ພົບສິນຄ້າ" });
    }

    const product = productResult[0];
    product.inventory = inventoryResult;

    console.log("Product data from database:", product); // Debug log
    console.log("ProductType_ID from database:", product.productType_ID); // Debug log
    if (req.user && req.user.userId) {
      const User_ID = req.user.userId
    await logActivity({
              userId: req.user.userId,
              activityType: ACTIVITY_TYPES.PASSWORD_CHANGE,
              description: `view by user with ID ${User_ID}`,
              relatedId: User_ID,
              ipAddress: req.ip || req.headers['x-forwarded-for'] || req.connection.remoteAddress,
              userAgent: req.headers['user-agent'] || null
            });
    }
    return res.status(200).json({
      message: "ດຶງຂໍ້ມູນສິນຄ້າສຳເລັດ",
      data: product
    });
  } catch (error) {
    console.error("get product by id error:", error);
    return res.status(500).json({ message: errMessage.server });
  }
};

const updateProductCtrl = async (req, res) => {
  let connection;
  const id = req.params.id;
  
  if (!id) {
    return res.status(400).json({ message: "ກະລຸນາລະບຸລະຫັດສິນຄ້າ (Product_ID)" });
  }

  try {
    connection = await conn.getConnection();
    await connection.beginTransaction();

    const [checkResult] = await connection.query(
      "SELECT COUNT(*) AS count FROM products WHERE Product_ID = ?",
      [id]
    );
    if (checkResult[0].count === 0) {
      await connection.rollback();
      return res.status(404).json({ message: "ບໍ່ພົບສິນຄ້າທີ່ຕ້ອງການແກ້ໄຂ" });
    }

    const {
      Name,
      Brand,
      Price,
      Description,
      Status,
      Image,
      productType_ID,
      Added_By,
      inventory = []
    } = req.body;


  
    if (!Name || !Price || !productType_ID) {
      await connection.rollback();
      return res.status(400).json({ message: "ກະລຸນາກອກຂໍ້ມູນທີ່ຈຳເປັນໃຫ້ຄົບຖ້ວນ" });
    }

    const price = parseFloat(Price);
    if (isNaN(price) || price < 10000) {
      await connection.rollback();
      return res.status(400).json({ message: "ລາຄາຂັ້ນຕ່ຳທີ່ອະນຸຍາດ: 10,000 ກີບ" });
    }
    if (price > 99999999.99) {
      await connection.rollback();
      return res.status(400).json({ message: "ລາຄາສູງສຸດທີ່ອະນຸຍາດ: 99,999,999.99 ກີບ" });
    }

    await connection.query(
      `UPDATE products 
       SET Name = ?, Brand = ?, Price = ?, Description = ?, Status = ?, Image = ?, 
           productType_ID = ?, Added_By = ?
       WHERE Product_ID = ?`,
      [Name, Brand, Price, Description, Status, Image, productType_ID, Added_By, id]
    );
    if (inventory && inventory.length > 0) {
      console.log("Processing inventory items..."); 
      await connection.query(productQueries.deleteInventoryByProduct, [id]);
      console.log("Deleted old inventory for product ID:", id);
      for (const item of inventory) {
        const { Size, Color, Quantity } = item;
        console.log("Processing inventory item:", { Size, Color, Quantity }); 
        if (Size && Color && Quantity !== undefined && Quantity >= 0) {
          await connection.query(productQueries.insertInventory, [
            id, Size, Color, Quantity
          ]);
          console.log("Inserted inventory item for product ID:", id); 
        } else {
          console.log("Skipping invalid inventory item:", item); 
        }
      }
    } else {
      console.log("No inventory items to process or empty inventory array"); 
    }

    await connection.commit();
    const User_ID = req.user.userId
        if (req.user && req.user.userId) {
            await logActivity({
              userId: req.user.userId,
              activityType: ACTIVITY_TYPES.PRODUCT_UPDATE,
              description: `Updated user with ID ${User_ID}`,
              relatedId: User_ID,
              ipAddress: req.ip || req.headers['x-forwarded-for'] || req.connection.remoteAddress,
              userAgent: req.headers['user-agent'] || null
            });
    }
    return res.status(200).json({ message: "ແກ້ຂສຳເລັດແລ້ວ" });

  } catch (error) {
    if (connection) {
      await connection.rollback();
    }
    console.error("update product error:", error);

    if (error.code === 'ER_DUP_ENTRY') {
      return res.status(409).json({ message: "ມີຂໍ້ມູນຊໍ້າກັນໃນລະບົບ" });
    }

    return res.status(500).json({ message: "ເກິດຂໍ້ຜິດພາດກັບເຊີບເວີ" });
  } finally {
    if (connection) {
      connection.release();
    }
  }
};

const deleteProductCtrl = async (req, res) => {
  let connection;
  const id = req.params.id;

  if (!id) {
    return res.status(400).json({ message: "ກະລຸນາລະບຸ IDຂອງສິນຄ້າທີ່ຕ້ອງການລົບ" });
  }

  try {
    connection = await conn.getConnection();
    await connection.beginTransaction();

    const [checkResult] = await connection.query(
      "SELECT COUNT(*) AS count FROM products WHERE Product_ID = ?",
      [id]
    );

    if (checkResult[0].count === 0) {
      await connection.rollback();
      return res.status(404).json({ message: "ບໍ່ພົບສິນຄ້າທີ່ຕ້ອງການລົບ" });
    }
    await connection.query(productQueries.deleteInventoryByProduct, [id]);
    
    await connection.query(productQueries.deleteProduct, [id]);

    await connection.commit();
    if (req.user && req.user.userId) {
      const User_ID = req.user.userId
    await logActivity({
              userId: req.user.userId,
              activityType: ACTIVITY_TYPES.PRODUCT_DELETE,
              description: `deleted by user with ID ${User_ID}`,
              relatedId: User_ID,
              ipAddress: req.ip || req.headers['x-forwarded-for'] || req.connection.remoteAddress,
              userAgent: req.headers['user-agent'] || null
            });
    }
    return res.status(200).json({ message: "ລົບສິນຄ້າສຳເລັດ" });

  } catch (error) {
    if (connection) {
      await connection.rollback();
    }
    console.error("ເກີດຂໍ້ຜິດພາດໃນການລົບສິນຄ້າ:", error);
    return res.status(500).json({ message: "ເກິດຂໍ້ຜິດພາດກັບເຊີບເວີ" });
  } finally {
    if (connection) {
      connection.release();
    }
  }
};
const searchProductsByNameCtrl = async (req, res) => {
  try {
    const { name } = req.query;
    if (!name) {
      return res.status(400).json({ message: "ກະລຸນາລະບຸສິນຄ້າທີ່ຈະຄົ້ນຫາ" });
    }

    const [results] = await conn.query(productQueries.searchProductByName, [`%${name}%`]);

    return res.status(200).json({
      message: "ຄ້ົ້ນຫາສິນຄ້າຕາມຊື່ສຳເລັດ",
      data: results,
    });

  } catch (error) {
    console.error("search products by name error:", error);
    return res.status(500).json({ message: "ເກິດຂໍ້ຜິດພາດກັບເຊີບເວີ" });
  }
};

const searchProductsByPriceRangeCtrl = async (req, res) => {
  try {
    const { minPrice, maxPrice } = req.query;

    if (!minPrice || !maxPrice) {
      return res.status(400).json({ message: "กรุณาระบุช่วงราคาทั้ง minPrice และ maxPrice" });
    }

    const [results] = await conn.query(
      `SELECT p.Product_ID, p.PID, p.Name, p.Brand, p.Price, p.Description, 
              p.Status, p.Image, pt.productType_Name AS productType, 
              p.Added_By, COALESCE(SUM(i.Quantity), 0) as totalStock
       FROM products p
       LEFT JOIN product_types pt ON p.productType_ID = pt.productType_ID
       LEFT JOIN inventory i ON p.Product_ID = i.Product_ID
       WHERE p.Price BETWEEN ? AND ?
       GROUP BY p.Product_ID, p.PID, p.Name, p.Brand, p.Price, p.Description, p.Status, p.Image, pt.productType_Name, p.Added_By`,
      [minPrice, maxPrice]
    );

    return res.status(200).json({
      message: "ຄ້ົ້ນຫາສິນຄ້າຕາມຊື່ສຳເລັດ",
      data: results,
    });

  } catch (error) {
    console.error("search products by price range error:", error);
    return res.status(500).json({ message: "ເກິດຂໍ້ຜິດພາດກັບເຊີບເວີ" });
  }
};

const getAllProductTypesCtrl = async (req, res) => {
  try {
    const [results] = await conn.query("SELECT * FROM product_types");
    return res.status(200).json({
      message: "ດຶງຂໍ້ມູນປະເພດສິນຄ້າສຳເລັດ",
      data: results,
    });
  } catch (error) {
    console.error("get product types error:", error);
    return res.status(500).json({ message: errMessage.server });
  }
};

module.exports = {
  getAllProductsCtrl,
  createProductCtrl,
  getProductByIdCtrl,
  updateProductCtrl,
  deleteProductCtrl,
  searchProductsByNameCtrl,
  searchProductsByPriceRangeCtrl,
  getAllProductTypesCtrl
};
