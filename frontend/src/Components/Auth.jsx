import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUser } from '../Store/zustand.js';
import Loader from './Loader.jsx';
import { GetCurrentUser , UpdateTokens} from '../Server/Server.js';

export default function Auth({ children }) {
    const navigate = useNavigate();
    const [loader, setLoader] = useState(true);
    const User = useUser((state) => state.user);
    const setUser = useUser((state) => state.setUser);

    const checkUser = async () => {
        try {
            let CurrentUser = await GetCurrentUser();
            if(!CurrentUser) {
                await UpdateTokens();
                CurrentUser = await GetCurrentUser();
            }
            if(CurrentUser._id !== User?._id) {
                setUser(null);
                console.log(User?._id);
                console.log(CurrentUser?._id);
                
                console.log("User not found in database in Auth.jsx");
                navigate("/login");
            }

            // console.log("user in auth.jsx: ", CurrentUser);
            return CurrentUser || null;
        } catch (error) {
            console.log("Failed to get current user in Auth.jsx: ", error);
            setUser(null);
            console.log("User not found in database in Auth.jsx");
            navigate("/login");
            return null;
        }
    };

    useEffect(() => {
        const fetchData = async () => {
            const CurrentUser = await checkUser();
            if (!CurrentUser) {
                setUser(null);
                console.log("User not found in Auth.jsx");
                navigate("/login");
            }
            setLoader(false);
        };
        fetchData();
    }, [setUser]);

    return loader ? <Loader /> : <>{children}</>;
}
