import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'


function Home() {
  const navigate = useNavigate();
  useEffect(() => {
    localStorage.removeItem('userStore');
  }, [])

  return (
    <div className='bg-gray-200 w-full h-[100vh]'>

      {/* header */}
      <div className='border-2 border-gray-300 bg-black/10 w-full h-[8vh] flex justify-between px-2 items-center'>

        <div className='cursor-pointer flex gap-2' >
          <img src="https://img.icons8.com/?size=100&id=jZHNPYILDZaH&format=png&color=000000" alt="logo1" className='h-[30px]' />
          <h2 className='text-2xl font-bold'>DeployDirect</h2>
        </div>
        <div>
          <div className='flex gap-2'>
            <button className='bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded'
              onClick={() => navigate('/login')}>
              Login
            </button>
            <button className='bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded'
              onClick={() => navigate('/register')}>
              SignUp
            </button>
          </div>
        </div>

      </div>

      {/* body */}

      <div className='w-full h-[92vh] flex justify-center items-center'>

        <div>
          <button className='text-3xl font-bold border-2 bg-gray-300 px-5 py-2 rounded-2xl'
            onClick={() => navigate('/login')}
          >
            Start Deploying
          </button>
        </div>

      </div>

    </div>
  )
}

export default Home