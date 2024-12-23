import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { LoginUser } from '../Server/Server.js';
import { useUser } from '../Store/zustand.js';

function Login() {
  const navigate = useNavigate();
  const SetUser = useUser((state) => state.setUser);

  const [userDetails, setUserDetails] = useState({
    email: '',
    password: '',
  });

  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Basic validation
    if (!userDetails.email || !userDetails.password) {
      alert('Please fill in all fields.');
      return;
    }

    // if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(userDetails.email)) {
    //   alert('Please enter a valid email address.');
    //   return;
    // }

    try {
      setLoading(true);
      const LoggedInUser = await LoginUser(userDetails);
      setLoading(false);

      if (LoggedInUser && LoggedInUser._id) {
        // console.log('Logged in user:', LoggedInUser);
        SetUser(LoggedInUser);
        navigate('/user-profile');
      } else {
        alert('Invalid login credentials. Please try again.');
      }
    } catch (error) {
      setLoading(false);
      console.error('Failed to log in:', error);
      alert('Login failed. Please try again later.');
    }
  };

  return (
    <div className="h-screen flex justify-center items-center">
      <div className="border bg-gray-100 grid grid-cols-1 gap-2 sm:gap-3 w-[80vw] sm:w-[40vw] p-2 rounded-xl max-w-[400px]">
        <h1 className="text-2xl text-center mb-2 font-bold">Login</h1>

        <input
          type="email"
          className="border rounded-lg w-full p-1 text-center focus:outline-none"
          placeholder="Email"
          value={userDetails.email}
          onChange={(e) =>
            setUserDetails({ ...userDetails, email: e.target.value })
          }
        />
        <input
          type="password"
          className="border rounded-lg w-full p-1 text-center focus:outline-none"
          placeholder="Password"
          value={userDetails.password}
          onChange={(e) =>
            setUserDetails({ ...userDetails, password: e.target.value })
          }
        />

        <button
          className={`bg-sky-400 text-white border rounded-lg w-full p-1 text-center ${loading ? 'opacity-50 cursor-not-allowed' : ''
            }`}
          onClick={handleSubmit}
          disabled={loading}
        >
          {loading ? 'Logging in...' : 'Submit'}
        </button>
        <button
          className="text-blue-600 hover:text-blue-400 mb-2 text-center font-semibold"
          onClick={() => navigate('/register')}
        >
          Create Account
        </button>
      </div>
    </div>
  );
}

export default Login;
