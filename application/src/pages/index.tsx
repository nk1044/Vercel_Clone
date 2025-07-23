import { Geist, Geist_Mono } from "next/font/google";
import Navbar from "@/components/Navbar";
import { Terminal } from 'lucide-react';
import TerminalUI from "@/components/tools/terminal";
import { useRouter } from "next/navigation";
import Footer from "@/components/Footer";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export default function Home() {
  const router = useRouter();
  return (
    <>
      <Navbar />
      <div
        className={`${geistSans.className} ${geistMono.className} font-sans grid grid-rows-[auto_1fr_auto] items-stretch min-h-screen p-4 sm:p-8 text-white relative overflow-hidden`}
      >
        {/* Main Content */}
        <main className="row-start-1 flex flex-col items-center justify-center text-center gap-12 mx-auto relative z-10 px-4 sm:px-0 py-20 w-full max-w-[91.18%]">
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
            <button className="px-8 py-4 cursor-pointer bg-white text-black rounded-full font-medium text-base hover:bg-gray-100 transition-all duration-200 flex items-center gap-2"
              onClick={() => router.push("/projects")}>
              Start Deploying
            </button>
            <button className="px-8 py-4 cursor-pointer bg-transparent border border-gray-600 rounded-full font-medium text-base hover:bg-neutral-950 hover:border-gray-600 transition-all duration-200"
              onClick={() => router.push("/docs")}>
              Read Docs
            </button>
          </div>

          {/* Logo */}
          <div className="relative">
            <img src="/logo-main.png" alt="logo" className="w-28 h-28 sm:w-32 sm:h-32" />
          </div>
        </main>

        <section className="row-start-2 w-full flex justify-center items-center px-4 sm:px-0">
          <div className="py-16 px-4 sm:px-0 border-l border-r border-b border-neutral-800 w-full max-w-[91.18%] text-center">
            <h2 className="text-3xl sm:text-4xl font-bold leading-tight mx-auto text-neutral-100 max-w-3xl">
              Develop with your favorite tools.
              <br className="hidden sm:block" />
              <span className="text-neutral-400"> Launch globally, instantly.</span>
              <br className="hidden sm:block" />
              <span className="text-neutral-500"> Keep pushing boundaries.</span>
            </h2>
          </div>
        </section>

        <section className="row-start-3 w-full mt-2 flex justify-center items-center px-4 sm:px-0">
          <div className="py-20 px-4 sm:px-0 border-t border-l border-r border-neutral-800 w-full max-w-[91.18%] text-center">
            <div className="flex flex-col lg:flex-row justify-between items-center gap-y-12 gap-x-12 w-full">

              {/* Text Block */}
              <div className="w-full md:w-1/2 ml-4 flex flex-col items-start text-left px-2 sm:px-4">
                <div className="flex items-center text-neutral-500 text-sm font-mono mb-3">
                  <Terminal className="mr-2 text-neutral-600" />
                  Git-connected Deploys
                </div>

                <h2 className="text-xl sm:text-2xl font-bold text-neutral-100 leading-tight">
                  From localhost to https, in seconds.
                </h2>

                <p className="text-neutral-400 text-base sm:text-md">
                  Deploy directly from any Git URL — zero config, full speed.
                </p>
              </div>

              {/* Terminal UI */}
              <div className="w-full lg:w-1/2 flex justify-center items-center">
                <TerminalUI />
              </div>
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className="row-start-4 w-full border-t border-neutral-800 text-gray-400 py-6 px-4 sm:px-8">
          <Footer />
        </footer>

      </div>
    </>
  );
}