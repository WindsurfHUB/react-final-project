import Link from "next/link";
import { redirect } from "next/navigation";
import LocationMap from "../../components/LocationMap";
import ReportForm from "../../components/ReportForm";
import SiteFooter from "../../components/SiteFooter";
import SiteHeader from "../../components/SiteHeader";
import { createClient } from "../../lib/supabase/server";

export const metadata = { title: "แจ้งประกาศ | ตามหา" };
export const runtime = "nodejs";

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
          <div className="page-title-row"><div><div className="eyebrow">MAKE A REPORT</div><h1>ช่วยลงประกาศ</h1><p>แชร์ข้อมูลให้ชุมชนช่วยกันตามหาและส่งคืนของสำคัญ</p></div><span className="status-pill">ต้องเข้าสู่ระบบแล้ว</span></div>
        </div>
        <div className="form-layout">
          <ReportForm />
          <aside className="form-aside"><h3>เลือกตำแหน่งบนแผนที่</h3><p>ปักหมุดบริเวณที่ทำหายหรือพบ เพื่อช่วยให้ผู้อื่นระบุตำแหน่งได้ง่าย</p><LocationMap label="ตำแหน่งตัวอย่าง" /><div className="preview-note">TODO สำหรับ Nick: เปลี่ยนแผนที่ตัวอย่างเป็นตัวเลือกตำแหน่ง และส่ง latitude/longitude เข้าฟอร์ม ตอนนี้สามารถกรอกชื่อสถานที่เพื่อส่งประกาศได้</div></aside>
        </div>
      </main>
      <SiteFooter />
    </div>
  );
}
