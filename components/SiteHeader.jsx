"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { createClient } from "../lib/supabase/client";

function Mark() {
  return (
    <span className="brand-mark" aria-hidden="true">
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M5 8.5 12 4l7 4.5v7L12 20l-7-4.5z" />
        <path d="m5.5 8.8 6.5 4 6.5-4M12 13v6.5" />
        <path d="m9.1 6 7 4.2" />
      </svg>
    </span>
  );
}

export default function SiteHeader({ active = "" }) {
  const [user, setUser] = useState(null);
  const [mobileNavOpen, setMobileNavOpen] = useState(false);

  useEffect(() => {
    const supabase = createClient();
    let isMounted = true;
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      if (isMounted) setUser(session?.user ?? null);
    });

    supabase.auth.getUser().then(({ data: { user: currentUser } }) => {
      if (isMounted) setUser(currentUser ?? null);
    });

    return () => {
      isMounted = false;
      subscription.unsubscribe();
    };
  }, []);

  useEffect(() => {
    if (!mobileNavOpen) return undefined;
    function closeOnEscape(event) {
      if (event.key === "Escape") {
        setMobileNavOpen(false);
        document.getElementById("mobile-nav-toggle")?.focus();
      }
    }
    window.addEventListener("keydown", closeOnEscape);
    return () => window.removeEventListener("keydown", closeOnEscape);
  }, [mobileNavOpen]);

  const userName =
    user?.user_metadata?.full_name ||
    user?.user_metadata?.name ||
    user?.email ||
    "บัญชีของฉัน";
  const avatarUrl =
    user?.user_metadata?.avatar_url || user?.user_metadata?.picture;
  const avatarInitial = Array.from(userName.trim())[0] || "ฉัน";

  return (
    <header className="site-header">
      <a className="skip-link" href="#main-content">ข้ามไปยังเนื้อหาหลัก</a>
      <div className="container nav-row">
        <Link className="brand" href="/" aria-label="ตามหา หน้าแรก">
          <Mark />
          <span>ตามหา<small>CAMPUS LOST &amp; FOUND</small></span>
        </Link>
        <button
          className="mobile-nav-toggle"
          id="mobile-nav-toggle"
          type="button"
          aria-label={mobileNavOpen ? "ปิดเมนูหลัก" : "เปิดเมนูหลัก"}
          aria-expanded={mobileNavOpen}
          aria-controls="primary-navigation"
          onClick={() => setMobileNavOpen((open) => !open)}
        >
          <span aria-hidden="true" />
          <span aria-hidden="true" />
          <span aria-hidden="true" />
        </button>
        <nav
          className={`nav-links${mobileNavOpen ? " mobile-open" : ""}`}
          id="primary-navigation"
          aria-label="เมนูหลัก"
        >
          <Link href="/" aria-current={active === "home" ? "page" : undefined} onClick={() => setMobileNavOpen(false)}>หน้าแรก</Link>
          <Link href="/items" aria-current={active === "items" ? "page" : undefined} onClick={() => setMobileNavOpen(false)}>รายการของ</Link>
          <Link href="/saved" aria-current={active === "saved" ? "page" : undefined} onClick={() => setMobileNavOpen(false)}>รายการที่บันทึก</Link>
          {!user ? <Link className="mobile-nav-auth" href="/login" onClick={() => setMobileNavOpen(false)}>เข้าสู่ระบบ</Link> : null}
          {user ? <Link className="mobile-nav-auth" href="/my-posts" onClick={() => setMobileNavOpen(false)}>จัดการประกาศของฉัน</Link> : null}
        </nav>
        <div className="nav-actions">
          {user ? (
            <Link
              className="profile-link"
              href="/my-posts"
              aria-label="จัดการประกาศของฉัน"
              title={`${userName} · จัดการประกาศของฉัน`}
            >
              <span className="profile-avatar" aria-hidden="true">
                {avatarUrl ? (
                  <img src={avatarUrl} alt="" />
                ) : (
                  avatarInitial
                )}
              </span>
            </Link>
          ) : (
            <Link className="button button-light" href="/login">เข้าสู่ระบบ</Link>
          )}
          <Link className="button button-primary" href="/report"><span aria-hidden="true">＋</span> แจ้งของหาย</Link>
        </div>
      </div>
    </header>
  );
}
