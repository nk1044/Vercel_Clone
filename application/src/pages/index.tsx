import Image from "next/image";
import { Geist, Geist_Mono } from "next/font/google";
import Navbar from "@/components/Navbar";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export default function Home() {
  return (
    <>
    <Navbar />
    <div
      className={`${geistSans.className} ${geistMono.className} font-sans grid grid-rows-[auto_1fr_auto] items-stretch min-h-screen p-4 sm:p-8 text-white relative overflow-hidden`}
    >
      {/* Main Content */}
      <main className="row-start-2 flex flex-col items-center justify-center text-center gap-12 mx-auto relative z-10 px-4 sm:px-0 py-20 w-full max-w-[91.18%]">
        {/* Gradient Background */}
        <div className="absolute inset-0 -z-10">
          <div className="w-full h-full bg-black grid-pattern"></div>
          <div className="absolute inset-0 bg-gradient-radial pointer-events-none"></div>
        </div>

        {/* Headline */}
        <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold leading-tight max-w-4xl">
          Build and deploy on the Cloud.
        </h1>

        {/* Description */}
        <p className="text-gray-300 text-lg sm:text-xl max-w-2xl leading-relaxed">
          Connect your GitHub repo and launch your site instantly on a scalable cloud platform.
          <br />
          Simple, fast, more personalized web.
        </p>

        {/* CTA Buttons */}
        <div className="flex flex-wrap justify-center gap-4 mb-8">
          <button className="px-8 py-4 cursor-pointer bg-white text-black rounded-full font-medium text-base hover:bg-gray-100 transition-all duration-200 flex items-center gap-2">
            Start Deploying
          </button>
          <button className="px-8 py-4 cursor-pointer bg-transparent border border-gray-600 rounded-full font-medium text-base hover:bg-neutral-950 hover:border-gray-600 transition-all duration-200"
            onClick={() => window.location.href = "/docs"}>
            Read Docs
          </button>
        </div>

        {/* Logo */}
        <div className="relative">
          <img src="/logo-main.png" alt="logo" className="w-28 h-28 sm:w-32 sm:h-32" />
        </div>
      </main>

      {/* Footer */}
<footer className="row-start-3 w-full border-t border-neutral-800 text-gray-400 py-6 px-4 sm:px-8">
  <div className="max-w-7xl mx-auto flex flex-col sm:flex-row justify-between items-center gap-4 text-sm">
    
    {/* Left Side */}
    <p>© 2025 Deployment Server.</p>
    
    {/* Right Side - Add links or socials if needed */}
    <div className="flex gap-4">
      <a href="/docs" className="hover:text-white transition">Docs</a>
      <a href="https://github.com/nk1044/Vercel_Clone" target="_blank" className="hover:text-white transition">GitHub</a>
    </div>
  </div>
</footer>

    </div>
    </>
  );
}