"use client";

import StateMessage from "../../components/StateMessage";

export default function ItemsError({ reset }) {
  return (
    <main className="container auth-wrap" id="main-content" tabIndex="-1">
      <StateMessage
        icon="!"
        title="โหลดข้อมูลไม่สำเร็จ"
        text="เกิดข้อผิดพลาดระหว่างดึงประกาศ ลองใหม่อีกครั้ง"
        action={{ label: "ลองใหม่", onClick: reset }}
      />
    </main>
  );
}
