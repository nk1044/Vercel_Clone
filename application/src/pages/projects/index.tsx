import React from 'react'
import { useRouter } from 'next/router';
import ProjectLayout from "@/components/Layout";
import { showToast } from "@/components/tools/toast";

function page() {
    const router = useRouter();

    return (
        <>
        <ProjectLayout >
        <div className='w-full flex flex-col items-center justify-center p-8'>
            <div className='max-w-2xl text-center'>
                <div 
                    className='mb-8 hover:scale-105 transition-transform cursor-pointer'
                    onClick={() => router.replace('/')}
                >
                    <img src="/logo-main.png" alt="logo" className='w-20 h-20 mx-auto hover:spin-once' />
                </div>
                
                <h1 className='text-3xl font-bold mb-4'>Projects</h1>
                <p className='text-lg text-neutral-600 mb-8'>
                    Our Project Page is currently under construction.
                </p>

                <div className='w-16 h-1 bg-neutral-200 mx-auto mb-8'></div>

                <div className='space-y-4 mb-8'>
                    <p className='text-neutral-600'>
                        We're working hard to bring you comprehensive documentation.
                    </p>
                    <p className='text-neutral-600'>
                        Please check back soon for updates.
                    </p>
                </div>

                <button
                    onClick={() => router.replace('/')}
                    className='px-6 py-2 bg-black text-white rounded-md hover:bg-neutral-800 transition'
                >
                    Return to Dashboard
                </button>
                <button
                    onClick={() => showToast('This feature is under construction.')}
                    className='px-6 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition ml-4'
                >
                    Show Toast
                </button>
            </div>
        </div>
        </ProjectLayout>
        </>
    )
}


export default page;