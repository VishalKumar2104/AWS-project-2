import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import FirebaseAuthProvider from "@/components/auth/FirebaseAuthProvider";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = {
  title: "HireHub — Find Your Dream Job",
  description:
    "HireHub connects top talent with leading companies. Browse thousands of jobs, apply in minutes, and land your next role.",
  keywords: "jobs, hiring, recruitment, careers, job board",
  openGraph: {
    title: "HireHub — Find Your Dream Job",
    description: "Connect with top companies and find your next career opportunity.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={inter.variable}>
      <body className="font-sans antialiased">
        <FirebaseAuthProvider>{children}</FirebaseAuthProvider>
      </body>
    </html>
  );
}
