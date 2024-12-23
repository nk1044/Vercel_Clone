import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import {RouterProvider, createBrowserRouter} from 'react-router-dom'
import Home from './Pages/Home.jsx'
import UserProfile from './Pages/UserProfile.jsx'
import Login from './Pages/Login.jsx'
import Register from './Pages/Register.jsx'
import Auth from './Components/Auth.jsx'


const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
    children: [
      {path: '', element: <Home />},
      {path: 'user-profile', element:<UserProfile />},
      // {path: 'user-profile', element: <Auth> <UserProfile /> </Auth>},
      {path: 'login', element: <Login />},
      {path: 'register', element: <Register />}
    ]
  }
]);

createRoot(document.getElementById('root')).render(
  <>
    <RouterProvider router={router} />
  </>
)
