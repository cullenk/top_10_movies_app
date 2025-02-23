import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { signOut } from "firebase/auth";
import { auth } from "../config/firebase"; // Make sure to import auth
import { clearUser } from '../store/userSlice';
import { setMovies } from '../store/moviesSlice';
import { toast } from 'react-toastify'; // Assuming you're using react-toastify for notifications

function HeaderBar() {
    const [currentDate, setCurrentDate] = useState('');
    const user = useSelector(state => state.user);
    const dispatch = useDispatch();

    useEffect(() => {
      const date = new Date()
      const formattedDate = date.toLocaleDateString('en-US', {
        weekday: 'long',
        year: 'numeric', 
        month: 'short',
        day: 'numeric',
      });
      setCurrentDate(formattedDate)
    }, []);

    const logout = async () => {
      try {
        await signOut(auth);
        dispatch(clearUser());
        dispatch(setMovies(Array(10).fill(null)));
        toast.success('Logged out successfully');
      } catch (err) {
        console.error(err);
        toast.error('Error logging out');
      }
    };

    return (
      <section className="flex justify-between items-center">
        <p className="text-slate-50/45">{currentDate}</p>
        {user && (
          <>
            <p className="text-white m-0">Welcome, {user.email}</p>
            <button 
              onClick={logout} 
              className="cursor-pointer px-6 mb-2 py-2 text-white bg-blue-600 rounded-lg hover:bg-blue-900"
            >
              Logout
            </button>
          </>
        )}
      </section>
    );
}

export default HeaderBar;
