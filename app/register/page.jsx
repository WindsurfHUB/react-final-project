import Link from "next/link";
import AuthForm from "../../components/AuthForm";
import SiteFooter from "../../components/SiteFooter";
import SiteHeader from "../../components/SiteHeader";

export const metadata = { title: "สมัครสมาชิก | ตามหา" };

export default function RegisterPage() {
  return (
    <div className="site-shell">
      <SiteHeader />
      <main className="container auth-wrap" id="main-content" tabIndex="-1">
        <section className="auth-card">
          <span className="auth-icon">＋</span>
          <div className="eyebrow">JOIN THE COMMUNITY</div>
          <h1>สร้างบัญชี</h1>
          <p>เข้าร่วมชุมชนที่ช่วยกันดูแลและส่งคืนของสำคัญ</p>
          <AuthForm mode="register" />
          <div className="auth-switch">มีบัญชีอยู่แล้ว? <Link href="/login">เข้าสู่ระบบ</Link></div>
        </section>
      </main>
      <SiteFooter />
    </div>
  );
}
