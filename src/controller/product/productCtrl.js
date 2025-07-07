// ================= POPULAR & LATEST PRODUCTS =================
// Get popular products (by most reviews)
const getPopularProducts = async (req, res) => {
    try {
        console.log('Fetching popular products...');
        const [results] = await conn.query(productQueries.getPopularProducts);
        console.log('Raw results count:', results.length);
        
        // Parse the Stock JSON string for each product with error handling
        const productsWithParsedStock = results.map(product => {
            let parsedStock = [];
            try {
                if (product.Stock && product.Stock !== '[]' && product.Stock !== 'null') {
                    parsedStock = JSON.parse(product.Stock);
                }
            } catch (parseError) {
                console.error('Error parsing Stock JSON for product', product.Product_ID, ':', parseError);
                parsedStock = [];
            }
            
            return {
                ...product,
                Stock: parsedStock
            };
        });
        
        console.log('Processed products count:', productsWithParsedStock.length);
        
        res.status(200).json({ 
            message: 'Popular products retrieved successfully', 
            data: productsWithParsedStock 
        });
    } catch (error) {
        console.error('Error getting popular products:', error);
        res.status(500).json({ error: 'Failed to get popular products' });
    }
};

// Get latest products (by newest)
const getLatestProducts = async (req, res) => {
    try {
        console.log('Fetching latest products...');
        const [results] = await conn.query(productQueries.getLatestProducts);
        console.log('Raw results count:', results.length);
        
        // Parse the Stock JSON string for each product with error handling
        const productsWithParsedStock = results.map(product => {
            let parsedStock = [];
            try {
                if (product.Stock && product.Stock !== '[]' && product.Stock !== 'null') {
                    parsedStock = JSON.parse(product.Stock);
                }
            } catch (parseError) {
                console.error('Error parsing Stock JSON for product', product.Product_ID, ':', parseError);
                parsedStock = [];
            }
            
            return {
                ...product,
                Stock: parsedStock
            };
        });
        
        console.log('Processed products count:', productsWithParsedStock.length);
        
        res.status(200).json({ 
            message: 'Latest products retrieved successfully', 
            data: productsWithParsedStock 
        });
    } catch (error) {
        console.error('Error getting latest products:', error);
        res.status(500).json({ error: 'Failed to get latest products' });
    }
};
const conn = require('../../setting/connection');
const {cateQueries} = require('./query/categoryQuery')
const {productQueries,wishListQueries,reviewQueries} = require('./query/productQuery')
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
        await conn.query(wishListQueries.delete,[Product_ID])
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
        
        const { Address_ID, totalAmount, items, paymentMethode } = req.body;

        if (!Address_ID || !totalAmount || !items || !Array.isArray(items)) {
            return res.status(400).json({ message: 'Missing required fields' });
            }
        if (!paymentMethode) {
            return res.json({message:'please select payment methode'})
        }
        if(paymentMethode === 'destination'){
           try {
            //shipment
            const Tracking_Number = uuidv4().slice(0, 10);
            const shipmentData ={
                Tracking_Number,
                Ship_Status:'preparing',
                Ship_Date: new Date()
            }
            const [shipment] = await conn.query(orderQuery.insertShipment,shipmentData);
            //order
            const Shipment_ID = shipment.insertId
            const rawUuid = uuidv4()
             const OID = 'OID' +rawUuid.replace(/-/g,'').slice(0, 10);
             const Order_Date = new Date()
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
                const CID = 'CID'+ rawUuid.replace(/-/g,'').slice(0,15)
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
             const [carts] = await conn.query(orderQuery.callToDelete,Order_ID)
             for(const item of carts){
                const [[stockRow]] = await conn.query(orderQuery.checkStock,[item.Product_ID, item.Size, item.Color]
                );

                if (!stockRow || stockRow.Quantity < item.Quantity) {
                    return res.status(400).json({
                    message: `Not enough stock for Product ID ${item.Product_ID}, Color ${item.Color}, Size ${item.Size}`
                    });
                }
                await conn.query(orderQuery.deleteStock,[item.Quantity,item.Product_ID,item.Size,item.Color]) 
             }
             return res.json({message:"success data"})
           } catch (error) {
            console.log(error);
           }
        }
    } catch (error) {
        console.error(error);
    }
}

//==================== REVIEWS ====================

// Get all reviews for a product
const getProductReviews = async (req, res) => {
    try {
        const Product_ID = req.params.productId;
        
        if (!Product_ID) {
            return res.status(400).json({ message: 'Product ID is required' });
        }

        const [reviews] = await conn.query(reviewQueries.getProductReviews, [Product_ID]);
        
        res.status(200).json({
            message: 'Reviews retrieved successfully',
            data: reviews
        });
    } catch (error) {
        console.error('Error getting product reviews:', error);
        res.status(500).json({ error: 'Failed to get reviews' });
    }
};

// Get review summary for a product
const getReviewSummary = async (req, res) => {
    try {
        const Product_ID = req.params.productId;
        
        if (!Product_ID) {
            return res.status(400).json({ message: 'Product ID is required' });
        }

        const [summary] = await conn.query(reviewQueries.getReviewSummary, [Product_ID]);
        
        if (summary.length === 0) {
            return res.status(200).json({
                message: 'No reviews found',
                data: {
                    totalReviews: 0,
                    averageRating: 0,
                    rating5: 0,
                    rating4: 0,
                    rating3: 0,
                    rating2: 0,
                    rating1: 0
                }
            });
        }

        // Format the average rating to 1 decimal place
        const summaryData = {
            ...summary[0],
            averageRating: parseFloat(summary[0].averageRating || 0).toFixed(1)
        };

        res.status(200).json({
            message: 'Review summary retrieved successfully',
            data: summaryData
        });
    } catch (error) {
        console.error('Error getting review summary:', error);
        res.status(500).json({ error: 'Failed to get review summary' });
    }
};

// Add or update a review
const addOrUpdateReview = async (req, res) => {
    try {
        const User_ID = req.user.userId;
        const { Product_ID, Rating, Comment } = req.body;

        // Validation
        if (!Product_ID || !Rating) {
            return res.status(400).json({ message: 'Product ID and Rating are required' });
        }

        if (Rating < 1 || Rating > 5) {
            return res.status(400).json({ message: 'Rating must be between 1 and 5' });
        }

        // Check if user already reviewed this product
        const [existingReview] = await conn.query(reviewQueries.checkUserReview, [User_ID, Product_ID]);

        if (existingReview.length > 0) {
            // Update existing review
            await conn.query(reviewQueries.updateReview, [Rating, Comment || '', User_ID, Product_ID]);
            res.status(200).json({ message: 'Review updated successfully' });
        } else {
            // Insert new review
            await conn.query(reviewQueries.insertReview, [User_ID, Product_ID, Rating, Comment || '']);
            res.status(201).json({ message: 'Review added successfully' });
        }
    } catch (error) {
        console.error('Error adding/updating review:', error);
        res.status(500).json({ error: 'Failed to add/update review' });
    }
};

// Get user's review for a specific product
const getUserReview = async (req, res) => {
    try {
        const User_ID = req.user.userId;
        const Product_ID = req.params.productId;

        if (!Product_ID) {
            return res.status(400).json({ message: 'Product ID is required' });
        }

        const [userReview] = await conn.query(reviewQueries.getUserReview, [User_ID, Product_ID]);

        if (userReview.length === 0) {
            return res.status(200).json({
                message: 'No review found',
                data: null
            });
        }

        res.status(200).json({
            message: 'User review retrieved successfully',
            data: userReview[0]
        });
    } catch (error) {
        console.error('Error getting user review:', error);
        res.status(500).json({ error: 'Failed to get user review' });
    }
};

// Delete user's review
const deleteUserReview = async (req, res) => {
    try {
        const User_ID = req.user.userId;
        const Product_ID = req.params.productId;

        if (!Product_ID) {
            return res.status(400).json({ message: 'Product ID is required' });
        }

        // Check if review exists
        const [existingReview] = await conn.query(reviewQueries.checkUserReview, [User_ID, Product_ID]);

        if (existingReview.length === 0) {
            return res.status(404).json({ message: 'Review not found' });
        }

        await conn.query(reviewQueries.deleteReview, [User_ID, Product_ID]);

        res.status(200).json({ message: 'Review deleted successfully' });
    } catch (error) {
        console.error('Error deleting review:', error);
        res.status(500).json({ error: 'Failed to delete review' });
    }
};

module.exports = {
    getProducts,
    getCategories,
    getProductCtrl,
    insertWishlistCtrl,
    deletetWishlistCtrl,
    showWishlist,
    insertAddressCtrl,
    showAddressCtrl,
    checkoutCtrl,
    // Review functions
    getProductReviews,
    getReviewSummary,
    addOrUpdateReview,
    getUserReview,
    deleteUserReview
    ,getPopularProducts
    ,getLatestProducts
};
