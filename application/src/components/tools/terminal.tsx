import React from "react";

export default function TerminalUI() {
  return (
    <div className="relative w-full max-w-lg mx-auto">
      {/* Terminal Window */}
      <div className="bg-neutral-900 border border-neutral-800 rounded-xl p-4 text-white font-mono text-sm leading-relaxed shadow-xl backdrop-blur-sm">
        {/* Window top bar with 3 circles */}
        <div className="flex gap-2 mb-4">
          <div className="w-3 h-3 rounded-full bg-red-500"
          ></div>
          <div className="w-3 h-3 rounded-full bg-yellow-400"></div>
          <div className="w-3 h-3 rounded-full bg-green-500"></div>
        </div>
        <div className="whitespace-pre-wrap">
          <span className="text-gray-400">⛭ ~ deployment-server/</span> git push
          <br />
          Enumerating objects: 1, done.
          <br />
          Counting objects: 100% (1/1), done.
          <br />
          Writing objects: 100% (1/1), 72 bytes, done.
          <br />
          Total 1 (delta 0), reused 0 (delta 0).
          <br />
          To github.com:vercel/vercel-site.git
          <br />
          <span className="text-gray-600">21326a9..8a2b0dc</span>
        </div>
      </div>

      {/* Browser Window - Positioned Overlap */}
      <div className="absolute left-1/2 -bottom-8 -translate-x-1/2 bg-neutral-950 border border-neutral-800 rounded-xl w-[90%] sm:w-[95%] shadow-lg text-white text-center p-4 pt-6 backdrop-blur-sm">
        {/* Fake address bar */}
        <div className="flex items-center justify-center gap-2 text-sm text-neutral-400 mb-4">
          <div className="w-3 h-3 rounded-full bg-red-500"></div>
          <div className="w-3 h-3 rounded-full bg-yellow-400"></div>
          <div className="w-3 h-3 rounded-full bg-green-500"></div>
          <span className="ml-4">🔒 deployment server</span>
        </div>
        <h2 className="text-2xl font-bold text-neutral-700">What will you ship?</h2>
      </div>
    </div>
  );
}
