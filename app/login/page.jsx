import Link from "next/link";
import SiteFooter from "../../components/SiteFooter";
import SiteHeader from "../../components/SiteHeader";

export const metadata = { title: "เข้าสู่ระบบ | ตามหา" };

export default function LoginPage() {
  return (
    <div className="site-shell"><SiteHeader /><main className="container auth-wrap"><section className="auth-card"><span className="auth-icon">↗</span><div className="eyebrow">WELCOME BACK</div><h1>เข้าสู่ระบบ</h1><p>ลงชื่อเข้าใช้เพื่อแจ้งประกาศและติดตามสิ่งของที่กำลังตามหา</p><div className="form-field"><label className="form-label" htmlFor="email">อีเมล</label><input className="form-control" id="email" type="email" placeholder="you@example.com" /></div><div className="form-field"><label className="form-label" htmlFor="password">รหัสผ่าน</label><input className="form-control" id="password" type="password" placeholder="กรอกรหัสผ่าน" /></div><button className="button button-primary" type="button" aria-disabled="true" style={{ width: "100%" }}>เข้าสู่ระบบ</button><div className="auth-switch">ยังไม่มีบัญชี? <Link href="/register">สมัครสมาชิก</Link></div><div className="preview-note">หน้าลงชื่อเข้าใช้สำหรับพรีวิว · ระบบยืนยันตัวตนจะเชื่อมในขั้นถัดไป</div></section></main><SiteFooter /></div>
  );
}
