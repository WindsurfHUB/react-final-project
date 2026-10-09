import "./globals.css";

export const metadata = {
  title: "ตามหา | Campus Lost & Found",
  description: "พื้นที่กลางสำหรับแจ้งของหายและของที่เก็บได้ในมหาวิทยาลัย",
};

export default function RootLayout({ children }) {
  return (
    <html lang="th" data-scroll-behavior="smooth">
      <body>{children}</body>
    </html>
  );
}
