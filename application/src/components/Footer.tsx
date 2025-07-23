import React from 'react'

function Footer() {
    return (
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row justify-between items-center gap-4 text-sm">

            {/* Left Side */}
            <p>© 2025 Deployment Server.</p>

            {/* Right Side - Add links or socials if needed */}
            <div className="flex gap-4">
                <a href="/docs" className="hover:text-white transition">Docs</a>
                <a href="https://github.com/nk1044/Vercel_Clone" target="_blank" className="hover:text-white transition">GitHub</a>
            </div>
        </div>
    )
}

export default Footer