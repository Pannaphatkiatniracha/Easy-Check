import jwt from 'jsonwebtoken'

export const verifyToken = (req, res, next) => {
    // Extract token from the authorization header
    const authHeader = req.headers.authorization
    const token = authHeader && authHeader.split(' ')[1] // Split to get the token (skip 'Bearer')

    if (!token) {
        return res.status(401).json({ message: 'Login first! Token not provided.' })
    }

    // Token exists, attempt to verify it
    try {
        // Verify the token using the secret key
        const decoded = jwt.verify(token, process.env.JWT_SECRET)

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