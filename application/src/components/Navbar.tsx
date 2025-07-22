import { useRouter } from 'next/navigation';
import React from 'react';
import { useSession, signIn, signOut } from "next-auth/react";
import { CircleUserRound } from 'lucide-react';

function Navbar() {

    const links = [
        { name: 'Docs', path: '/docs' },
        { name: 'Projects', path: '/projects' },
    ];

    const router = useRouter();

    const { data: session } = useSession();

    return (
        <div className='w-full flex justify-between items-center p-3'>
            <div className='flex items-center gap-4'>
                {/* heading and nav links */}
                <div className='flex items-center gap-1 ml-6 cursor-pointer'
                onClick={() => router.push('/')}>
                    <img src="/logo.png" alt="logo" className='w-6 h-6 hover:spin-once' />
                    <h1 className='text-2xl font-semibold '>Deploy</h1>
                </div>

                {/* links */}
                <div className='hidden md:flex justify-end gap-6 ml-5 pt-1'>
                    {links.map((link) => (
                        <span
                            key={link.name}
                            onClick={() => router.push(link.path)}
                            className='text-neutral-400 text-sm hover:text-neutral-300 hover:bg-neutral-700 py-1 px-2 cursor-pointer rounded-2xl transition-colors'
                        >
                            {link.name}
                        </span>
                    ))}
                </div>
            </div>

            <div className='flex items-center gap-4 mr-6'>
                {/* login/ profile, settings */}
                {session ? (
                    <div className='flex items-center gap-3'>
                        <button className='text-neutral-100 px-3 py-1 border border-neutral-800 rounded-md text-md cursor-pointer hover:bg-neutral-800 transition-colors'
                            onClick={() => signOut()}>
                            Logout
                        </button>
                        <button className='w-7 h-7 border border-neutral-600 rounded-full overflow-hidden flex items-center justify-center cursor-pointer hover:scale-105 transition-transform'>
                            <img src={session.user?.image as string} alt="logo" />
                        </button>
                    </div>
                ):(
                    <button className='text-neutral-100 px-3 py-1 border border-neutral-800 rounded-md text-md cursor-pointer hover:bg-neutral-800 transition-colors'
                        onClick={() => router.push('/auth')}>
                        Login
                    </button>
                )}
            </div>
        </div>
    )
}

export default Navbar