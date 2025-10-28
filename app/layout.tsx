import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Relationship Intelligence",
  description: "Stay thoughtfully connected with the people who matter",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased">
        {children}
      </body>
    </html>
  );
}
