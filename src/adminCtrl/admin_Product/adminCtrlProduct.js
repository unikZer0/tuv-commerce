
const conn = require('../../setting/connection');
const { productQueries } = require('./ProductQueries');
const { sucMessage, errMessage } = require('../../service/messages');
const { v4: uuidv4 } = require("uuid");
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
  try {
    const rawUuid = uuidv4(); 
    const PID = await 'PID' + rawUuid.replace(/-/g, '').split(0, 13);
    if (!PID) {
      return res.status(400).json({ message: errMessage.invalidData });
    }
    const { Name, Brand, Price, Description, Status, Image, productType_ID, Added_By } = req.body;

    if (!PID || !Name || !Price || !productType_ID) {
      return res.status(400).json({ message: errMessage.invalidData });
    }

    const [result] = await conn.query(productQueries.insertProduct, [
      PID, Name, Brand, Price, Description, Status, Image, productType_ID, Added_By
    ]);

    return res.status(201).json({
      message: sucMessage.created,
      data: { Product_ID: result.insertId }
    });
  } catch (error) {
    console.error("create product error:", error);

    if (error.code === 'ER_DUP_ENTRY') {
      return res.status(409).json({ message: errMessage.duplicate });
    }

    return res.status(500).json({ message: errMessage.server });
  }
};


const updateProductCtrl = async (req, res) => {
  const id = req.params.id;
  if (!id) {
    return res.status(400).json({ message: "ກະລຸນາລະບຸລະຫັດສິນຄ້າ (Product_ID)" });
  }
  try {
    const [checkResult] = await conn.query(
      "SELECT COUNT(*) AS count FROM products WHERE Product_ID = ?",
      [id]
    );
    if (checkResult[0].count === 0) {
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
      Shop_ID,
      Added_By,
    } = req.body;

    if (!Name || !Price || !productType_ID) {
      return res.status(400).json({ message: "ກະລຸນາກອກຂໍ້ມູນທີ່ຈຳເປັນໃຫ້ຄົບຖ້ວນ" });
    }
    await conn.query(
      `UPDATE products 
       SET Name = ?, Brand = ?, Price = ?, Description = ?, Status = ?, Image = ?, 
           productType_ID = ?, Added_By = ?
       WHERE Product_ID = ?`,
      [
        Name,
        Brand,
        Price,
        Description,
        Status,
        Image,
        productType_ID,
        Added_By,
        id,
      ]
    );

    return res.status(200).json({ message: "ແກ້ຂສຳເລັດແລ້ວ" });

  } catch (error) {
    console.error("update product error:", error);

    if (error.code === 'ER_DUP_ENTRY') {
      return res.status(409).json({ message: "ມີຂໍ້ມູນຊໍ້າກັນໃນລະບົບ" });
    }

    return res.status(500).json({ message: "ເກິດຂໍ້ຜິດພາດກັບເຊີບເວີ" });
  }
};


const deleteProductCtrl = async (req, res) => {
  const id = req.params.id;
  if (!id) {
    return res.status(400).json({ message: "ກະລຸນາລະບຸ IDຂອງສິນຄ້າທີ່ຕ້ອງການລົບ" });
  }

  try {
    const [checkResult] = await conn.query(
      "SELECT COUNT(*) AS count FROM products WHERE Product_ID = ?",
      [id]
    );

    if (checkResult[0].count === 0) {
      return res.status(404).json({ message: "ບໍ່ພົບສິນຄ້າທີ່ຕ້ອງການລົບ" });
    }

    await conn.query("DELETE FROM products WHERE Product_ID = ?", [id]);

    return res.status(200).json({ message: "ລົບສິນຄ້າສຳເລັດ" });

  } catch (error) {
    console.error("ເກີດຂໍ້ຜິດພາດໃນການລົບສິນຄ້າ:", error);
    return res.status(500).json({ message: "ເກິດຂໍ້ຜິດພາດກັບເຊີບເວີ" });
  }
};



const searchProductsByNameCtrl = async (req, res) => {
  try {
    const { name } = req.query;
    if (!name) {
      return res.status(400).json({ message: "ກະລຸນາລະບຸສິນຄ້າທີ່ຈະຄົ້ນຫາ" });
    }

    const [results] = await conn.query(
      `SELECT p.Product_ID, p.PID, p.Name, p.Brand, p.Price, p.Description, 
              p.Status, p.Image, pt.productType_Name AS productType, 
              s.Shop_Name AS shopName, p.Added_By
       FROM products p
       JOIN product_types pt ON p.productType_ID = pt.productType_ID
       JOIN shops s ON p.Shop_ID = s.Shop_ID
       WHERE p.Name LIKE ?`,
      [`%${name}%`]
    );

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
              s.Shop_Name AS shopName, p.Added_By
       FROM products p
       JOIN product_types pt ON p.productType_ID = pt.productType_ID
       JOIN shops s ON p.Shop_ID = s.Shop_ID
       WHERE p.Price BETWEEN ? AND ?`,
      [minPrice, maxPrice]
    );

    return res.status(200).json({
      message: "ค้นหาสินค้าตามช่วงราคาสำเร็จ",
      data: results,
    });

  } catch (error) {
    console.error("search products by price range error:", error);
    return res.status(500).json({ message: "ເກິດຂໍ້ຜິດພາດກັບເຊີບເວີ" });
  }
};

const getAllProductTypesCtrl = async (req, res) => {
  try {
    const [results] = await conn.query('SELECT productType_ID, productType_Name FROM product_types;');
    res.json({ data: results });
  } catch (err) {
    return res.status(500).json({ message: 'Database error', error: err });
  }
};

module.exports = {
  getAllProductsCtrl,
  createProductCtrl,
  updateProductCtrl,
  deleteProductCtrl,
  searchProductsByNameCtrl,
  searchProductsByPriceRangeCtrl,
  getAllProductTypesCtrl
};
