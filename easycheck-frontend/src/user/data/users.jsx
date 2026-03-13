const users = [
    {
        user: '060606',
        pass: 'pass',
        role: 'user',
        token: 'usertoken',
    },
    {
        user: '111111',
        pass: 'pass',
        role: 'approver',
        token: 'approvertoken',
    },
]

export function verifyUser(user, pass) {

    // .find เพื่อหาข้อมูลที่กรอกมาแล้วตรงทั้ง user และ pass ถึงจะเก็บข้อมูล
    const userFound = users.find((u) => {
        return u.user === user && u.pass === pass
    })

    // ถ้ามันกรอกถูกก็จะได้ค่า role กับ token ส่งไปให้ login
    return userFound ? { role: userFound.role, token: userFound.token } : null

}