import Navbar from "@/components/Navbar";
import Footer from "./Footer";
import { ReactNode } from "react";
import { Toaster } from "react-hot-toast";

export default function Layout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen">
      <Navbar />
      <Toaster />
      <main>{children}</main>
      <Footer />
    </div>
  );
}
