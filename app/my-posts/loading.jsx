import SiteFooter from "../../components/SiteFooter";
import SiteHeader from "../../components/SiteHeader";

export default function MyPostsLoading() {
  return (
    <div className="site-shell">
      <SiteHeader />
      <main className="container" id="main-content" tabIndex="-1">
        <div className="loading-container" role="status" aria-live="polite">
          <h1 className="visually-hidden">ประกาศของฉัน</h1>
          <div className="spinner" />
          <p>กำลังโหลดประกาศของคุณ…</p>
        </div>
      </main>
      <SiteFooter />
    </div>
  );
}
