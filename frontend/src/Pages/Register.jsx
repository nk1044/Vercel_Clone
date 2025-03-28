import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { RegisterUser, GuestUser } from '../Server/Server.js';
import { useUser } from '../Store/zustand.js';

function Register() {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
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

  const handleGuestUser = async () => {
    try {
      const response = await GuestUser();
      if(response) {
        setZustandUser(response);
        navigateToPage();
      }
    } catch (error) {
      console.log("Failed to login as guest user: ", error);
      setError('Failed to login as guest user. Please try again.');
    }
  }

  return (
    <div className="flex w-full items-center justify-center min-h-screen bg-gradient-to-br from-blue-50 to-gray-100 p-4 sm:p-6 lg:p-8">
      <div className="w-full max-w-md bg-white p-6 sm:p-8 rounded-2xl shadow-xl">
        <div className="space-y-6">
          {/* Header */}
          <div className="text-center space-y-2">
            <h2 className="text-3xl font-bold text-gray-800">Create Account</h2>
            <p className="text-gray-500">Join us and start your journey</p>
            {error && <p className="text-red-500">{error}</p>}
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Full Name Input */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">Full Name</label>
              <div className="relative">
                
                <input
                  type="text"
                  name="fullName"
                  value={localUser.username}
                  onChange={(e) => setLocalUser(prev => ({ ...prev, username: e.target.value }))}
                  placeholder="John Doe"
                  className="w-full pl-2 pr-4 py-2.5 text-gray-700 bg-gray-50 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-all"
                />
              </div>
            </div>

            {/* Email Input */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">Email</label>
              <div className="relative">
               
                <input
                  type="email"
                  name="email"
                  // value={formData.email}
                  onChange={(e) => setLocalUser(prev => ({ ...prev, email: e.target.value }))}
                  placeholder="example@email.com"
                  className="w-full pl-2 pr-4 py-2.5 text-gray-700 bg-gray-50 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-all"
                />
              </div>
            </div>

            {/* Password Input */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">Password</label>
              <div className="relative">
                
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  
                  onChange={(e) => setLocalUser(prev => ({ ...prev, password: e.target.value }))}
                  placeholder="••••••••"
                  className="w-full pl-2 pr-12 py-2.5 text-gray-700 bg-gray-50 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-all"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showPassword ? '👁️' : '👁️‍🗨️'}
                </button>
              </div>
            </div>

            
            {/* Submit Button */}
            <button
              type="submit"
              className="w-full py-3 px-4 bg-blue-500 text-white text-sm font-semibold rounded-lg shadow-md hover:bg-blue-600 focus:ring-2 focus:ring-blue-300 focus:ring-offset-2 transition-all duration-200 ease-in-out transform hover:-translate-y-0.5"
            >
              Create Account
            </button>

            {/* Divider */}
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-200"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-4 bg-white text-gray-500">or continue with</span>
              </div>
            </div>

            <button
              type="button"
              className="w-full py-3 px-4 bg-white border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 focus:ring-2 focus:ring-offset-2 focus:ring-gray-200 transition-all duration-200 flex items-center justify-center space-x-2"
              onClick={handleGuestUser}
            >
              <span>Sign up as a Guest user</span>
            </button>
          </form>

          {/* Login Link */}
          <p className="text-center text-sm text-gray-600">
            Already have an account?{' '}
            <button className="text-blue-500 hover:text-blue-600 font-medium hover:underline focus:outline-none"
              onClick={() => navigate('/login')}
            >
              Log in
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}

export default Register;
