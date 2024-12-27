import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { RegisterUser } from '../Server/Server.js';
import { useUser } from '../Store/zustand.js';

function Register() {
  const navigate = useNavigate();
  const setZustandUser = useUser(state => state.setUser);

  const [localUser, setLocalUser] = useState({
    username: '',
    email: '',
    password: '',
  });
  const [error, setError] = useState('');

  const navigateToPage = () => {
    const user = useUser.getState().user;
    if (user?._id) {
      navigate('/user-profile');
    } else {
      console.log("User not found in store in register.jsx");
      // navigate('/login');
    }
  };

  const handleSubmit = async (e) => {
    try {
      e.preventDefault();
      
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(localUser?.email)) {
        alert('Please enter a valid email address.');
        return;
      }

      const registeredUser = await RegisterUser(localUser);
      // console.log("registered User: ", registeredUser);
      setZustandUser(registeredUser);
      navigateToPage();
    } catch (error) {
      console.log("Failed to register user: ", error);
      setError('Failed to register. Please try again.');
    }
  };

  return (
    <div className="h-screen flex justify-center items-center">
      <div className="border bg-gray-100 grid grid-cols-1 gap-2 sm:gap-3 w-[80vw] sm:w-[40vw] p-2 rounded-xl max-w-[400px]">
        <h1 className="text-2xl text-center mb-2 font-bold">Register</h1>

        {error && <p className="text-red-500 text-center">{error}</p>}

        <input
          type="text"
          className="border rounded-lg w-full p-1 text-center focus:outline-none"
          placeholder="Username"
          aria-label="Username"
          onChange={(e) => setLocalUser(prev => ({ ...prev, username: e.target.value }))}
        />

        <input
          type="email"
          className="border rounded-lg w-full p-1 text-center focus:outline-none"
          placeholder="Email"
          aria-label="Email"
          onChange={(e) => setLocalUser(prev => ({ ...prev, email: e.target.value }))}
        />

        <input
          type="password"
          className="border rounded-lg w-full p-1 text-center focus:outline-none"
          placeholder="Password"
          aria-label="Password"
          onChange={(e) => setLocalUser(prev => ({ ...prev, password: e.target.value }))}
        />

        <button
          className="bg-sky-400 text-white border rounded-lg w-full p-1 text-center"
          onClick={handleSubmit}
        >
          Submit
        </button>
        <button
          className="text-blue-600 hover:text-blue-400 mb-2 text-center"
          onClick={() => navigate('/login')}
        >
          Login
        </button>
      </div>
    </div>
  );
}

export default Register;
