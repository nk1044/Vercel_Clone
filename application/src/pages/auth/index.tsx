import React from 'react';
import { useSession, signIn, signOut } from "next-auth/react";

function Index() {
  const { data: session } = useSession();

  return (
    <div className="w-full min-h-screen flex items-center justify-center">
      {session ? (
        <div className="w-full max-w-lg mx-auto text-center">
          <h1 className="text-3xl font-bold mb-4">Welcome, {session.user?.name}</h1>
          <p className="text-lg text-neutral-600 mb-8">You are now logged in.</p>
          <button
            onClick={() => signOut()}
            className="px-6 py-2 bg-gray-100 text-black cursor-pointer rounded-md text-lg font-semibold hover:bg-gray-200 transition hover:scale-105 active:scale-100"
          >
            Sign Out
          </button>
        </div>
      ) : (
        <div className="w-full max-w-md mx-auto border border-neutral-800 rounded-lg shadow-md p-8 flex flex-col items-center gap-6">
          <div className="text-center">
            <h2 className="text-3xl font-bold mb-2">Welcome Back</h2>
            <p className="text-neutral-600">Please sign in to continue</p>
          </div>

          <button
            onClick={() => signIn('google', { callbackUrl: '/' })}
            className="w-full flex items-center text-neutral-950 cursor-pointer justify-center gap-3 px-5 py-3 bg-gray-100 rounded-md text-lg font-semibold hover:bg-gray-300 transition hover:scale-105 active:scale-100"
          >
            <img src="/google.png" alt="Login with" className="w-6 h-6" />
            <span>Continue with Google</span>
          </button>
        </div>
      )}
    </div>
  );
}

export default Index;
