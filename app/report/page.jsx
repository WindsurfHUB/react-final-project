import Link from "next/link";
import { redirect } from "next/navigation";
import LocationMap from "../../components/LocationMap";
import SiteFooter from "../../components/SiteFooter";
import SiteHeader from "../../components/SiteHeader";
import { createClient } from "../../lib/supabase/server";

export const metadata = { title: "แจ้งประกาศ | ตามหา" };

export default async function ReportPage() {
  const supabase = await createClient();
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  if (error || !user) {
    redirect("/login");
  }

  return (
    <div className="site-shell">
      <SiteHeader />
      <main className="container">
        <div className="page-top">
          <div className="breadcrumb"><Link href="/">หน้าแรก</Link><span>›</span><span>แจ้งประกาศ</span></div>
          <div className="page-title-row"><div><div className="eyebrow">MAKE A REPORT</div><h1>ช่วยลงประกาศ</h1><p>แชร์ข้อมูลให้ชุมชนช่วยกันตามหาและส่งคืนของสำคัญ</p></div><span className="status-pill">ตัวอย่างหน้าฟอร์ม</span></div>
        </div>
        <div className="form-layout">
          <section className="form-card">
            <h2>รายละเอียดสิ่งของ</h2><p>กรอกข้อมูลพื้นฐานและตำแหน่ง เพื่อให้เจ้าของหรือผู้พบเห็นค้นหาได้ง่ายขึ้น</p>
            <div className="form-field"><span className="form-label">ประเภทประกาศ</span><div className="choice-row"><div className="choice selected">◉ กำลังตามหาของ</div><div className="choice">○ พบของ</div></div></div>
            <div className="form-field"><label className="form-label" htmlFor="item-title">ชื่อสิ่งของ</label><input className="form-control" id="item-title" placeholder="เช่น หูฟังไร้สาย เคสสีขาว" /></div>
            <div className="form-field"><label className="form-label" htmlFor="item-category">หมวดหมู่</label><select className="form-control" id="item-category" defaultValue=""><option value="" disabled>เลือกหมวดหมู่</option><option>อุปกรณ์อิเล็กทรอนิกส์</option><option>ของใช้ส่วนตัว</option><option>เอกสารและบัตร</option></select></div>
            <div className="form-field"><label className="form-label" htmlFor="item-description">รายละเอียดเพิ่มเติม</label><textarea className="form-control" id="item-description" placeholder="สี ลักษณะ หรือจุดสังเกตของสิ่งของ" /></div>
            <div className="form-field"><label className="form-label" htmlFor="item-location">สถานที่</label><input className="form-control" id="item-location" placeholder="อาคารหรือจุดที่พบ/ทำหาย" /></div>
            <div className="form-field"><span className="form-label">รูปภาพ</span><div className="upload-box"><span aria-hidden="true">＋</span><strong>เพิ่มรูปสิ่งของ</strong><small>รองรับการอัปโหลดในเวอร์ชันถัดไป</small></div></div>
            <button className="button button-primary" type="button" aria-disabled="true">ดูตัวอย่างการส่งประกาศ</button>
          </section>
          <aside className="form-aside"><h3>เลือกตำแหน่งบนแผนที่</h3><p>ปักหมุดบริเวณที่ทำหายหรือพบ เพื่อช่วยให้ผู้อื่นระบุตำแหน่งได้ง่าย</p><LocationMap label="แตะเพื่อเลือกตำแหน่ง" /><div className="preview-note">แผนที่และฟอร์มนี้เป็นภาพตัวอย่าง ยังไม่บันทึกข้อมูลหรือส่งพิกัด</div></aside>
        </div>
      </main>
      <SiteFooter />
    </div>
  );
}
