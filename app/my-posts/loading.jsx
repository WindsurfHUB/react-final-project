import SiteFooter from "../../components/SiteFooter";
import SiteHeader from "../../components/SiteHeader";

export default function MyPostsLoading() {
  return (
    <div className="site-shell">
      <SiteHeader />
      <main className="container">
        <div className="loading-container" role="status" aria-live="polite">
          <div className="spinner" />
          <p>กำลังโหลดประกาศของคุณ…</p>
        </div>
      </main>
      <SiteFooter />
    </div>
  );
}
