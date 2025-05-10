module.exports = function authorizeRole (...allowedRoles) {
    return (req,res,next) =>{

        const userRole = req.user.role
        console.log(userRole);
        
        if (!userRole || !allowedRoles.includes(userRole)) {
            console.log(userRole);
            
            return res.status(403).json({Message:"Access dinined : wrong role"})
        }
        next()
    }
}
