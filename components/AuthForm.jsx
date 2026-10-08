"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "../lib/supabase/client";

export default function AuthForm({ mode }) {
  const router = useRouter();
  const isRegister = mode === "register";
  const [pending, setPending] = useState(false);
  const [feedback, setFeedback] = useState(null);

  async function handleSubmit(event) {
    event.preventDefault();
    if (pending) return;

    const form = event.currentTarget;
    const formData = new FormData(form);
    const email = String(formData.get("email") ?? "").trim();
    const password = String(formData.get("password") ?? "");
    const fullName = String(formData.get("fullName") ?? "").trim();

    setPending(true);
    setFeedback(null);

    try {
      const supabase = createClient();

      if (isRegister) {
        const { data, error } = await supabase.auth.signUp({
          email,
          password,
          options: { data: { full_name: fullName } },
        });

        if (error) {
          setFeedback({ type: "error", message: error.message });
        } else if (data.session) {
          router.replace("/items");
          router.refresh();
        } else {
          setFeedback({
            type: "success",
            message: `ส่งลิงก์ยืนยันไปที่ ${email} แล้ว กรุณาตรวจสอบอีเมล`,
          });
          form.reset();
        }
        return;
      }

      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        setFeedback({ type: "error", message: error.message });
        return;
      }

      router.replace("/items");
      router.refresh();
    } catch (error) {
      setFeedback({
        type: "error",
        message: error?.message || "เกิดข้อผิดพลาด กรุณาลองอีกครั้ง",
      });
    } finally {
      setPending(false);
    }
  }

  return (
    <form className="auth-form" onSubmit={handleSubmit}>
      {isRegister ? (
        <div className="form-field">
          <label className="form-label" htmlFor="full-name">ชื่อที่แสดง</label>
          <input
            className="form-control"
            id="full-name"
            name="fullName"
            autoComplete="name"
            maxLength={80}
            placeholder="ชื่อของคุณ"
            required
          />
        </div>
      ) : null}

      <div className="form-field">
        <label className="form-label" htmlFor="auth-email">อีเมล</label>
        <input
          className="form-control"
          id="auth-email"
          name="email"
          type="email"
          autoComplete="email"
          autoCapitalize="none"
          placeholder="you@example.com"
          required
        />
      </div>

      <div className="form-field">
        <label className="form-label" htmlFor="auth-password">รหัสผ่าน</label>
        <input
          className="form-control"
          id="auth-password"
          name="password"
          type="password"
          autoComplete={isRegister ? "new-password" : "current-password"}
          minLength={isRegister ? 8 : undefined}
          placeholder={isRegister ? "อย่างน้อย 8 ตัวอักษร" : "กรอกรหัสผ่าน"}
          required
        />
      </div>

      {feedback ? (
        <p
          className={`auth-message auth-message-${feedback.type}`}
          role={feedback.type === "error" ? "alert" : "status"}
          aria-live="polite"
        >
          {feedback.message}
        </p>
      ) : null}

      <button className="button button-primary" type="submit" disabled={pending}>
        {pending
          ? isRegister ? "กำลังสร้างบัญชี..." : "กำลังเข้าสู่ระบบ..."
          : isRegister ? "สมัครสมาชิก" : "เข้าสู่ระบบ"}
      </button>
    </form>
  );
}