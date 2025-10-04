import type { Metadata } from "next";
import { Lexend_Deca } from "next/font/google";
import "./globals.css";
import Header from "@/app/frontend/components/Header";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const fontFamily = Lexend_Deca({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-lexend-deca",
});

export const metadata: Metadata = {
  title: "Readfy",
  description: "Readfy - seu aplicativo de leitura",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-BR" className={fontFamily.variable}>
      <body className="font-sans min-h-screen flex flex-col bg-gradient-to-br from-blue-50 to-indigo-100">
        <Header />
        <main className="flex-1 pt-16">{children}</main>
        <ToastContainer
          position="top-right"
          autoClose={3000}
          hideProgressBar
          theme="colored"
        />
      </body>
    </html>
  );
}
