import Link from "next/link";
import AuthForm from "../../components/AuthForm";
import SiteFooter from "../../components/SiteFooter";
import SiteHeader from "../../components/SiteHeader";

export const metadata = { title: "เข้าสู่ระบบ | ตามหา" };

export default function LoginPage() {
  return (
    <div className="site-shell">
      <SiteHeader />
      <main className="container auth-wrap">
        <section className="auth-card">
          <span className="auth-icon">↗</span>
          <div className="eyebrow">WELCOME BACK</div>
          <h1>เข้าสู่ระบบ</h1>
          <p>ลงชื่อเข้าใช้เพื่อแจ้งประกาศและติดตามสิ่งของที่กำลังตามหา</p>
          <AuthForm mode="login" />
          <div className="auth-switch">ยังไม่มีบัญชี? <Link href="/register">สมัครสมาชิก</Link></div>
        </section>
      </main>
      <SiteFooter />
    </div>
  );
}
