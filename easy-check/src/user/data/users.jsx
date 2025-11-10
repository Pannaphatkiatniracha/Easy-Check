const users = [
    {
    user: 'user', 
    pass: 'pass',
    role: 'role',
    token: 'user',
    }
]

export function verifyUser( user, pass){

    // เอาไว้เก็บข้อมูล ถ้าตรงทั้ง user และ pass ถึงจะเก็บข้อมูล
    const userFound = users.find( (u) => {
        return u.user === user && u.pass === pass
    })

    // ถ้ามันกรอกถูกก็จะได้ค่า role กับ token ส่งไปให้ login
    return userFound ? { role: userFound.role, token: userFound.token} : null
    
}