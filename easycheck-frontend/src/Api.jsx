import axios from 'axios';

const HOST = 'localhost'
const PORT = '5000'

// สร้างตัวแปรกลาง
const Api = axios.create({
    baseURL: `http://${HOST}:${PORT}`,
    headers: {
        'Content-Type': 'application/json'
    }
});

// interceptors.request คือเช็คก่อนจะส่งออกไป พอมีการยิง api ตรงนี้มันจะเช็คว่ามี token มั้ย
Api.interceptors.request.use(
    (config) => {
        // token ใบสั้น
        const token = localStorage.getItem('token')
        
        if (token) {
            config.headers.Authorization = `Bearer ${token}` // ถ้ามี token ให้ส่งกลับให้แบคเอน check
        }
        return config
    },
    (error) => {
        return Promise.reject(error)
    }
)

// ถ้า token พังต้องไป /refresh-token
Api.interceptors.response.use(
    (response) => response, // ถ้าแบคเอนตอบกลับมาปกติ (200) ก็ปล่อยผ่านไปหน้า UI เลย
    
    async (error) => {
        const originalRequest = error.config // เก็บ "คำสั่งเดิม" ที่พนักงานเพิ่งสั่งมาไว้ก่อน

        // ถ้ายังไม่ได้ login ไม่มี token
        if ((error.response?.status === 401 || error.response?.status === 403) && !originalRequest._retry) {
            originalRequest._retry = true // บอกไว้ว่า "กุกำลังพยายามแก้ปัญหาให้อยู่จ้า" ห้ามวนลูป!

            try {
                // ไปหยิบ token ยาว (refreshToken) ตอน Login มาใช้
                const refreshToken = localStorage.getItem('refreshToken')

                // ยิงไปหาแบคเอน
                const res = await axios.post(`http://${HOST}:${PORT}/auth/refresh-token`, { refreshToken })

                // OK
                if (res.status === 200) {
                    // แลก token ใหม่
                    const { accessToken, refreshToken: newRefreshToken } = res.data

                    localStorage.setItem('token', accessToken)
                    localStorage.setItem('refreshToken', newRefreshToken)

                    // เอาตั๋วใหม่ไปแปะในคำสั่งเดิมที่เคยพังเมื่อกี้
                    Api.defaults.headers.common['Authorization'] = `Bearer ${accessToken}`
                    // Body (ข้อมูล) คือสิ่งที่เราส่งให้แบคเอน
                    // Header (token) คือสิ่งที่บอกว่าเรามีสิทธิ์ส่งข้อมูลนี้ไหม

                    
                    // ยิง token กลับไปแต่อันนี้ token ใหม่แล้ว
                    return Api(originalRequest)
                }
            } catch (refreshError) {
                // ถ้า newRefreshToken หมดอายุ
                console.log("Session expired. Please login again")
                localStorage.clear()
                window.location.href = '/login'
            }
        }

        // ถ้าเป็น Error อื่น ๆ ก็ส่งกลับไปให้หน้า UI จัดการตามปกติ
        return Promise.reject(error)
    }
)

export default Api