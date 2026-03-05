// โค้ดหลังบ้านสำหรับดึงข้อมูล Leaderboard โดยซ่อน URL จริง
export default async function handler(req, res) {
  try {
    // 🔒 ดึงลิงก์จากระบบ Environment Variables ใน Vercel
    const sheetUrl = process.env.LEADERBOARD_SHEET_URL; 
    
    if (!sheetUrl) {
      return res.status(500).json({ error: 'Config Error: Missing LEADERBOARD_SHEET_URL' });
    }

    const response = await fetch(sheetUrl);
    if (!response.ok) throw new Error('Failed to fetch from Google Sheets');
    
    const data = await response.text();

    // ส่งข้อมูล CSV กลับไปให้หน้าบ้าน และตั้งค่า Cache เพื่อลดภาระการดึงข้อมูล
    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Cache-Control', 's-maxage=300, stale-while-revalidate'); // อัปเดตทุก 5 นาที
    res.status(200).send(data);
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
}
