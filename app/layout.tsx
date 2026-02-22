import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Navbar } from "@/components/layout/Navbar";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "KET Circuit Complexity Profiler | Quantum Analysis",
  description: "Instantly profile quantum circuit complexity, entanglement growth, and simulation hardness 100% locally in your browser.",
  openGraph: {
    title: "KET Circuit Complexity Profiler",
    description: "Visualize quantum circuit complexity and entanglement growth.",
    type: "website",
    url: "https://ket-profiler.io",
    images: ["/og-image.png"],
  },
  twitter: {
    card: "summary_large_image",
    title: "KET Circuit Complexity Profiler",
    description: "Visualize quantum circuit complexity and entanglement growth.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body className={`${inter.className} bg-black text-white antialiased`}>
        <div className="relative min-h-screen">
          {/* Background effects */}
          <div className="fixed inset-0 -z-10 overflow-hidden">
            <div className="absolute -top-1/4 -left-1/4 h-[1000px] w-[1000px] rounded-full bg-indigo-500/10 blur-[120px]" />
            <div className="absolute top-1/2 -right-1/4 h-[800px] w-[800px] rounded-full bg-purple-500/10 blur-[100px]" />
          </div>

          <Navbar />
          <main className="pt-16">
            {children}
          </main>
        </div>
      </body>
    </html>
  );
}
