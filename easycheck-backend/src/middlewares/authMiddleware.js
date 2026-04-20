import jwt from 'jsonwebtoken'

// ใช้ใน admin controllers เพื่อกรองข้อมูลเฉพาะสาขาของ admin ที่ login
export const branchFilter = (req, alias = 'u') => {
    const { branch_id } = req.user
    if (!branch_id) throw new Error('Admin token missing branch_id')
    return { clause: `AND ${alias}.branch_id = ?`, params: [branch_id] }
}

export const verifyToken = (req, res, next) => {
    // Extract token from the authorization header
    const authHeader = req.headers.authorization
    
    // เพิ่มการรองรับ Token จาก Query String (req.query.token) สำหรับ EventSource (SSE)
    const token = (authHeader && authHeader.split(' ')[1]) || req.query.token 

    if (!token) {
        return res.status(401).json({
        success: false,
        message: 'Login first! Token not provided.'
})
    }

    // Token exists, attempt to verify it
    try {
        // Verify the token using the secret key
        const decoded = jwt.verify(token, process.env.JWT_SECRET)

        console.log("decoded token:", decoded)

        // If token is valid, attach user data to the request
        req.user = decoded

        next() // Proceed to the next middleware or route handler

    } catch (error) {
        console.error('Token verification failed:', error.message) // Log the error for debugging

        // Handle different types of errors (Expired token vs Invalid token)
        if (error.name === 'TokenExpiredError') {
            // Add more info about token expiry (Optional)
            console.error('Token expired at:', error.expiredAt)
            return res.status(401).json({ message: 'Token expired. Please login again.' })
        }

        // Invalid token or other errors
        return res.status(403).json({ message: 'Forbidden. Invalid token.' })
    }
}