import Link from "next/link";

export default function SiteFooter() {
  return (
    <footer className="footer">
      <div className="container footer-row">
        <div>
          <Link className="brand" href="/">
            <span className="brand-mark" aria-hidden="true">⌕</span>
            <span>ตามหา<small>CAMPUS LOST &amp; FOUND</small></span>
          </Link>
          <div className="footer-copy" style={{ marginTop: 12 }}>พื้นที่กลางสำหรับช่วยให้ของสำคัญได้กลับบ้าน</div>
        </div>
        <div className="footer-links"><Link href="/items">ดูรายการ</Link><Link href="/report">แจ้งของหาย</Link><Link href="/login">เข้าสู่ระบบ</Link></div>
      </div>
    </footer>
  );
}
