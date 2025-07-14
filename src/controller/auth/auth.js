const conn = require('../../setting/connection')
const jwt = require('jsonwebtoken')
const {loginQuery,registerQuery,checkExist} = require('./query')
const {sucMessage,errMessage} = require('../../service/messages')
const bcrypt = require('bcrypt')
const { logActivity, ACTIVITY_TYPES } = require('../../service/activityLogger');
const { v4: uuidv4 } = require("uuid");
const secret = 'mysecret'
const validator = require('validator')
const loginCtrl = async (req,res)=>{
    try {
        const {identifier,Password} = req.body
        if (!identifier || !Password) {
            return res.status(400).json({ message: "Missing identifier or Password" });
          }
          
          const [results] = await conn.query(loginQuery,[identifier,identifier])
        if(results.length === 0) {
            return res.status(401).json({message :errMessage.login});
        }
        const user = results[0]
        const match = await bcrypt.compare(Password,user.Password)
        if(!match){
            return res.status(401).json({message:errMessage.notMatch});
        }
        const token = jwt.sign({userId: user.User_ID,role: user.Role_id,},secret,{
            expiresIn:'20h'
        })
        console.log('token :' ,token);
        if (!req.user) {
            await logActivity({
              userId: user.User_ID,
              activityType: ACTIVITY_TYPES.LOGIN,
              description: `login with ID ${user.User_ID}`,
              relatedId: user.User_ID,
              ipAddress: req.ip || req.headers['x-forwarded-for'] || req.connection.remoteAddress,
              userAgent: req.headers['user-agent'] || null
            });
          }
      
        return res.status(200).json({
            message: sucMessage.login || "Login successful",
            token,
            role:user.Role_id,
            userId: user.User_ID
          });
    } catch (error) {
        console.log("err :" ,error);
        res.status(500).json({message: "error server"})
    }
}
const regitserCtrl = async(req,res)=>{
    try {
//required
const rawUuid = uuidv4();
        const {
            FirstName,
            LastName,
            Email,
            Phone,
            Datebirth,
            Sex,
            Password,
            Images
          } = req.body;
          
          if (!FirstName || !LastName || !Email || ! Phone || !Datebirth || !Sex || !Password  ) {
            return res.status(400).json({message: errMessage.requireField})
          }
//isEmail
          if (!validator.isEmail(Email)) {
            res.status(401).json({message:errMessage.invEmail})
          }
//check existing Password
          const [exists] = await conn.query(checkExist,[Email,Phone])
          if(exists.length > 0){
           return res.status(400).json({message:errMessage.exists})
          }
//hash Password
          const UID =  'UID' + rawUuid.replace(/-/g,'').slice(0, 10);
          const salt = await bcrypt.genSalt(10)
          const hashPwd = await bcrypt.hash(Password , salt)
//free field 
          const RegistrationDate = new Date();
          const Role_id = 3
//insert
          const userData = await conn.query(registerQuery,[UID,FirstName,LastName,Email,Phone,Datebirth,Sex,hashPwd,Images || null ,RegistrationDate,Role_id])
          const results = userData[0]
          console.log(results);
        
          
          return res.status(201).json({message:sucMessage.insert , users:results})
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: errMessage.server });
    } 
}
const getUserProfile = async (req, res) => {
  try {
    const userId = req.user.userId; // From token verification
    
    const [results] = await conn.query(
      'SELECT User_ID, UID, Role_id, FirstName, LastName, Email, Phone, DATE_FORMAT(Datebirth, "%Y-%m-%d") as Datebirth, Sex, Images, DATE_FORMAT(Registration_Date, "%Y-%m-%d") as Registration_Date FROM users WHERE User_ID = ?',
      [userId]
    );

    if (results.length === 0) {
      return res.status(404).json({ message: "User not found" });
    }

    return res.status(200).json({
      success: true,
      data: results[0]
    });

  } catch (error) {
    console.error("Get user profile error:", error);
    return res.status(500).json({ message: "Server error" });
  }
};

const updateUserProfile = async (req, res) => {
  try {
    const userId = req.user.userId; // From token verification
    const { FirstName, LastName, Email, Phone, Datebirth, Sex } = req.body;

    // Check if user exists
    const [userCheck] = await conn.query('SELECT User_ID FROM users WHERE User_ID = ?', [userId]);
    if (userCheck.length === 0) {
      return res.status(404).json({ message: "User not found" });
    }

    // Check if email is already taken by another user
    const [emailCheck] = await conn.query(
      'SELECT User_ID FROM users WHERE Email = ? AND User_ID != ?',
      [Email, userId]
    );
    if (emailCheck.length > 0) {
      return res.status(400).json({ message: "Email already exists" });
    }

    const [results] = await conn.query(
      'UPDATE users SET FirstName = ?, LastName = ?, Email = ?, Phone = ?, Datebirth = ?, Sex = ?, updated_at = NOW() WHERE User_ID = ?',
      [FirstName, LastName, Email, Phone, Datebirth, Sex, userId]
    );

    if (results.affectedRows === 0) {
      return res.status(404).json({ message: "User not found" });
    }

    // Get updated user data with formatted dates
    const [updatedUser] = await conn.query(
      'SELECT User_ID, UID, FirstName, LastName, Email, Phone, DATE_FORMAT(Datebirth, "%Y-%m-%d") as Datebirth, Sex, Images, DATE_FORMAT(Registration_Date, "%Y-%m-%d") as Registration_Date FROM users WHERE User_ID = ?',
      [userId]
    );

    return res.status(200).json({
      success: true,
      message: "Profile updated successfully",
      data: updatedUser[0]
    });

  } catch (error) {
    console.error("Update user profile error:", error);
    return res.status(500).json({ message: "Server error" });
  }
};

const deleteUserProfile = async (req, res) => {
  try {
    const userId = req.user.userId; // From token verification

    // Check if user exists
    const [userCheck] = await conn.query('SELECT User_ID FROM users WHERE User_ID = ?', [userId]);
    if (userCheck.length === 0) {
      return res.status(404).json({ message: "User not found" });
    }

    // Get a connection from the pool for transaction
    const connection = await conn.getConnection();
    
    try {
      // Start transaction
      await connection.beginTransaction();

      // Delete related data in order (child tables first)
      
      // 1. Delete wishlist items
      await connection.query('DELETE FROM wishlist WHERE User_ID = ?', [userId]);
      
      // 2. Delete reviews
      await connection.query('DELETE FROM reviews WHERE User_ID = ?', [userId]);
      
      // 3. Get all orders for this user
      const [orders] = await connection.query('SELECT Order_ID FROM orders WHERE User_ID = ?', [userId]);
      
      // 4. Delete payments first (because payments references orders)
      for (const order of orders) {
        await connection.query('DELETE FROM payments WHERE Order_ID = ?', [order.Order_ID]);
      }
      
      // 5. Delete cart items (because cart references orders)
      await connection.query('DELETE FROM cart WHERE User_ID = ?', [userId]);
      
      // 6. Delete orders (because orders references address)
      await connection.query('DELETE FROM orders WHERE User_ID = ?', [userId]);
      
      // 7. Delete addresses (after orders are deleted)
      await connection.query('DELETE FROM address WHERE User_ID = ?', [userId]);
      
      // 8. Finally delete the user
      const [results] = await connection.query('DELETE FROM users WHERE User_ID = ?', [userId]);

      if (results.affectedRows === 0) {
        throw new Error("Failed to delete user");
      }

      // Commit transaction
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

      return res.status(200).json({
        success: true,
        message: sucMessage.accountDeleted
      });

    } catch (error) {
      // Rollback transaction on error
      await connection.rollback();
      throw error;
    } finally {
      // Release the connection back to the pool
      connection.release();
    }

  } catch (error) {
    console.error("Delete user profile error:", error);
    return res.status(500).json({ 
      message: errMessage.deleteAccountFailed
    });
  }
};

const changePassword = async (req, res) => {
  try {
    const userId = req.user.userId; // From token verification
    const { currentPassword, newPassword } = req.body;

    // Validate input
    if (!currentPassword || !newPassword) {
      return res.status(400).json({ message: "Current password and new password are required" });
    }

    if (newPassword.length < 6) {
      return res.status(400).json({ message: "New password must be at least 6 characters long" });
    }

    // Get current user data
    const [userResults] = await conn.query('SELECT Password FROM users WHERE User_ID = ?', [userId]);
    if (userResults.length === 0) {
      return res.status(404).json({ message: "User not found" });
    }

    const user = userResults[0];

    // Verify current password
    const isCurrentPasswordValid = await bcrypt.compare(currentPassword, user.Password);
    if (!isCurrentPasswordValid) {
      return res.status(400).json({ message: "Current password is incorrect" });
    }

    // Hash new password
    const salt = await bcrypt.genSalt(10);
    const hashedNewPassword = await bcrypt.hash(newPassword, salt);

    // Update password
    const [updateResults] = await conn.query(
      'UPDATE users SET Password = ?, updated_at = NOW() WHERE User_ID = ?',
      [hashedNewPassword, userId]
    );

    if (updateResults.affectedRows === 0) {
      return res.status(404).json({ message: "Failed to update password" });
    }
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

    return res.status(200).json({
      success: true,
      message: "Password changed successfully"
    });

  } catch (error) {
    console.error("Change password error:", error);
    return res.status(500).json({ message: "Server error" });
  }
};

module.exports = {loginCtrl,regitserCtrl,getUserProfile,updateUserProfile,deleteUserProfile,changePassword}
