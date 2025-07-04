const conn = require('../../setting/connection')
const jwt = require('jsonwebtoken')
const {loginQuery,registerQuery,checkExist} = require('./query')
const {sucMessage,errMessage} = require('../../service/messages')
const bcrypt = require('bcrypt')
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
      
        return res.status(200).json({
            message: sucMessage.login || "Login successful",
            token,
            role:user.Role_id,
            userId: user.User_ID
          });
    } catch (error) {
        console.log("err :" ,error);
        
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
          
          return res.status(201).json({message:sucMessage.insert , users:userData})
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: errMessage.server });
    } 
}
const getUserProfile = async (req, res) => {
  try {
    const userId = req.user.userId; // From token verification
    
    const [results] = await conn.query(
      'SELECT User_ID, UID, FirstName, LastName, Email, Phone, DATE_FORMAT(Datebirth, "%Y-%m-%d") as Datebirth, Sex, Images, DATE_FORMAT(Registration_Date, "%Y-%m-%d") as Registration_Date FROM users WHERE User_ID = ?',
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

    // Delete user (this will cascade delete related records due to foreign key constraints)
    const [results] = await conn.query('DELETE FROM users WHERE User_ID = ?', [userId]);

    if (results.affectedRows === 0) {
      return res.status(404).json({ message: "User not found" });
    }

    return res.status(200).json({
      success: true,
      message: "Account deleted successfully"
    });

  } catch (error) {
    console.error("Delete user profile error:", error);
    return res.status(500).json({ message: "Server error" });
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
