import Link from "next/link";
import SiteFooter from "../../components/SiteFooter";
import SiteHeader from "../../components/SiteHeader";

export const metadata = { title: "สมัครสมาชิก | ตามหา" };

export default function RegisterPage() {
  return (
    <div className="site-shell"><SiteHeader /><main className="container auth-wrap"><section className="auth-card"><span className="auth-icon">＋</span><div className="eyebrow">JOIN THE COMMUNITY</div><h1>สร้างบัญชี</h1><p>เข้าร่วมชุมชนที่ช่วยกันดูแลและส่งคืนของสำคัญ</p><div className="form-field"><label className="form-label" htmlFor="name">ชื่อที่แสดง</label><input className="form-control" id="name" placeholder="ชื่อของคุณ" /></div><div className="form-field"><label className="form-label" htmlFor="register-email">อีเมล</label><input className="form-control" id="register-email" type="email" placeholder="you@example.com" /></div><div className="form-field"><label className="form-label" htmlFor="register-password">รหัสผ่าน</label><input className="form-control" id="register-password" type="password" placeholder="อย่างน้อย 8 ตัวอักษร" /></div><button className="button button-primary" type="button" aria-disabled="true" style={{ width: "100%" }}>สมัครสมาชิก</button><div className="auth-switch">มีบัญชีอยู่แล้ว? <Link href="/login">เข้าสู่ระบบ</Link></div><div className="preview-note">หน้าสมัครสมาชิกสำหรับพรีวิว · ยังไม่มีการสร้างบัญชีจริง</div></section></main><SiteFooter /></div>
  );
}
