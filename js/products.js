// ข้อมูลสินค้าตัวอย่าง
const products = [
    {
        id: 1,
        name: "รถบังคับวิทยุ Super Racer",
        category: "vehicles",
        price: 1290,
        originalPrice: 1590,
        discount: true,
        rating: 4.5,
        image: "images/products/toycar.jpg",
        ageRange: "6-12 ปี",
        description: "รถบังคับวิทยุความเร็วสูง ควบคุมง่าย แบตเตอรี่ชาร์จไฟได้ วิ่งได้นานถึง 30 นาที"
    },
    {
        id: 2,
        name: "ตุ๊กตาหมีพูห์",
        category: "plush",
        price: 590,
        originalPrice: 590,
        discount: false,
        rating: 4.8,
        image: "images/products/toybear.jpg",
        ageRange: "3+ ปี",
        description: "ตุ๊กตาหมีพูห์นุ่มนิ่ม ขนาด 12 นิ้ว วัสดุคุณภาพดี ปลอดภัยสำหรับเด็ก"
    },
    {
        id: 3,
        name: "เลโก้ชุดสร้างบ้าน",
        category: "construction",
        price: 890,
        originalPrice: 1090,
        discount: true,
        rating: 4.7,
        image: "images/products/toybuild.jpg",
        ageRange: "5-12 ปี",
        description: "ชุดเลโก้สร้างบ้าน ขนาด 500 ชิ้น สร้างสรรค์จินตนาการให้เด็กๆ"
    },
    {
        id: 4,
        name: "เกมกระดาน Monopoly",
        category: "board-games",
        price: 790,
        originalPrice: 990,
        discount: true,
        rating: 4.6,
        image: "images/products/toyboard.jpg",
        ageRange: "8+ ปี",
        description: "เกมกระดาน Monopoly สำหรับครอบครัว เล่นได้ตั้งแต่ 2-6 คน"
    },
    {
        id: 5,
        name: "ชุดรถไฟรางไม้ Wood Train Set",
        category: "vehicles",
        price: 1190,
        originalPrice: 1490,
        discount: true,
        rating: 4.9,
        image: "images/products/toytrain.jpg",
        ageRange: "3-8 ปี",
        description: "ชุดรถไฟรางไม้คุณภาพดี ประกอบด้วยราง 40 ชิ้น รถไฟ 3 ขบวน อาคาร 4 หลัง และอุปกรณ์เสริมอื่นๆ ทำจากไม้เนื้อดีปลอดสารพิษ ชิ้นส่วนสามารถต่อประกอบได้หลากหลายรูปแบบ"
    },
    {
        id: 6,
        name: "ชุดการทดลองวิทยาศาสตร์ Science Lab Explorer",
        category: "educational",
        price: 1390,
        originalPrice: 1690,
        discount: true,
        rating: 4.8,
        image: "images/products/toyscience.jpg",
        ageRange: "8-14 ปี",
        description: "ชุดทดลองวิทยาศาสตร์สำหรับเด็ก มี 25 การทดลอง พร้อมอุปกรณ์ครบชุด และคู่มือภาษาไทย เหมาะสำหรับเด็กที่สนใจวิทยาศาสตร์ เคมี และฟิสิกส์เบื้องต้น"
    },
    {
        id: 7,
        name: "Mini Drone Explorer X1",
        category: "vehicles",
        price: 1990,
        originalPrice: 2490,
        discount: true,
        rating: 4.6,
        image: "images/products/toydrone.jpg",
        ageRange: "8+ ปี",
        description: "โดรนขนาดเล็กควบคุมผ่านแอปพลิเคชัน บินได้นาน 15 นาที พร้อมกล้องความละเอียด 720p ถ่ายภาพและวิดีโอได้ รัศมีบิน 50 เมตร"
    },

];

// ฟังก์ชันสำหรับค้นหาสินค้าตาม ID
function findProductById(id) {
    return products.find(product => product.id === parseInt(id)) || null;
}