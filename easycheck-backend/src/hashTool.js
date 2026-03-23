import bcrypt from 'bcrypt'

// for test
const passwordInput = '123456'

const generateHash = async () => {
    try {
        const saltRounds = 10 // hash ละเอียดแค่ไหนบดสับไปเลย 10 ชุด
        
        // hash password
        const hash = await bcrypt.hash(passwordInput, saltRounds)
        
        console.log("-------------------------------------------")
        console.log(`🤍 password: ${passwordInput}`)
        console.log(`🐻🐰 hash password: ${hash}`)
        console.log("-------------------------------------------")
        
    } catch (error) {
        console.error("Hashing failed:", error)
    }
}

generateHash()