import Link from "next/link";
import SiteFooter from "../../components/SiteFooter";
import SiteHeader from "../../components/SiteHeader";

export const metadata = { title: "รายการที่บันทึก | ตามหา" };

export default function SavedPage() {
  return (
    <div className="site-shell"><SiteHeader active="saved" /><main className="container"><div className="page-top"><div className="breadcrumb"><Link href="/">หน้าแรก</Link><span>›</span><span>รายการที่บันทึก</span></div><div className="page-title-row"><div><div className="eyebrow">YOUR SAVED ITEMS</div><h1>รายการที่บันทึก</h1><p>เก็บประกาศที่อยากกลับมาดูไว้ในที่เดียว</p></div></div></div><div className="empty-state"><span aria-hidden="true">♡</span><h2>รายการบันทึกจะแสดงที่นี่</h2><p>หน้านี้เป็นพรีวิวหน้าตาแอป รายการบันทึกจะเริ่มทำงานเมื่อเพิ่มระบบบันทึกในเวอร์ชันถัดไป</p><Link className="button button-primary" href="/items">เลือกดูประกาศ</Link></div><div style={{ height: 70 }} /></main><SiteFooter /></div>
  );
}
