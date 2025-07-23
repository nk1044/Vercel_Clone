import Navbar from "@/components/Navbar";
import Footer from "./Footer";
import { ReactNode } from "react";
import { Toaster } from "react-hot-toast";

export default function Layout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <Toaster />
      <main className="flex-1">{children}</main>
      <Footer />
    </div>
  );
}