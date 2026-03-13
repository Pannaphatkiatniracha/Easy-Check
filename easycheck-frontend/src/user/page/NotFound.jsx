import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const NotFound = () => {
    const back = useNavigate()
    useEffect( () => {
        back('../home') // เวลานางป้อนอะไรประหลาด ๆ จะให้ไปโผล่ที่หน้า home เสมอ
    }, []) // จะทำงานตอนที่ render
    return ( 
        <>

        </>
     );
}
 
export default NotFound