import type { Metadata } from "next";
import { Lexend_Deca } from "next/font/google";
import "./globals.css";
import Header from "@/app/v1/components/Header";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { ThemeProvider } from "./v1/components/theme/ThemeProvider";


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
    <html lang="pt-BR" className={fontFamily.variable} suppressHydrationWarning>
      <body className="font-sans min-h-screen flex flex-col transition-colors duration-300">
        <ThemeProvider>
          <Header />
          <main className="flex-1 pt-16 transition-colors duration-300">
            {children}
          </main>
          <ToastContainer
            position="top-right"
            autoClose={3000}
            hideProgressBar
            theme="colored"
            toastClassName="dark:bg-gray-800 dark:text-white book:bg-amber-50 book:text-amber-900"
          />
        </ThemeProvider>
      </body>
    </html>
  );
}