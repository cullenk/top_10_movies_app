import React, { useState, useEffect } from "react";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signInWithPopup,
  onAuthStateChanged
} from "firebase/auth";
import { auth, googleProvider, db } from "../config/firebase";
import { doc, setDoc } from "firebase/firestore";

function Auth() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLogin, setIsLogin] = useState(true);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      console.log("Current user:", currentUser?.email);
    });

    return () => unsubscribe();
  }, []);

  const handleAuth = async (e) => {
    e.preventDefault();
    try {
      let userCredential;
      if (isLogin) {
        userCredential = await signInWithEmailAndPassword(auth, email, password);
      } else {
        userCredential = await createUserWithEmailAndPassword(auth, email, password);
      }
      await createUserDocument(userCredential.user);
    } catch (err) {
      console.error(err);
      alert(err.message);
    }
  };

  const signInWithGoogle = async () => {
    try {
      const result = await signInWithPopup(auth, googleProvider);
      await createUserDocument(result.user);
    } catch (err) {
      console.error(err);
      alert(err.message);
    }
  };

  const createUserDocument = async (user) => {
    if (!user) return;
  
    const userRef = doc(db, "users", user.uid);
    try {
      const docSnap = await getDoc(userRef);
      if (!docSnap.exists()) {
        await setDoc(userRef, { email: user.email, topMovieList: [] });
      } else {
        await updateDoc(userRef, { email: user.email });
      }
      console.log("User document created/updated");
    } catch (error) {
      console.error("Error creating user document:", error);
    }
  };
  

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="px-8 py-6 mt-4 text-left bg-white shadow-lg">
        <h3 className="text-2xl font-bold text-center">
          {isLogin ? "Login Please?!" : "Sign Up"}
        </h3>
        <form onSubmit={handleAuth}>
          <div className="mt-4">
            <div>
              <label className="block" htmlFor="email">
                Email
              </label>
              <input
                type="email"
                placeholder="Email"
                className="w-full px-4 py-2 mt-2 border rounded-md focus:outline-none focus:ring-1 focus:ring-blue-600"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div className="mt-4">
              <label className="block">Password</label>
              <input
                type="password"
                placeholder="Password"
                className="w-full px-4 py-2 mt-2 border rounded-md focus:outline-none focus:ring-1 focus:ring-blue-600"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            <div className="flex items-baseline justify-between mt-4">
              <button
                type="submit"
                className="px-6 py-2 text-white bg-blue-600 rounded-lg hover:bg-blue-900"
              >
                {isLogin ? "Login" : "Sign Up"}
              </button>
              <button 
                type="button" 
                onClick={signInWithGoogle}
                className="px-6 py-2 text-white bg-red-600 rounded-lg hover:bg-red-900"
              >
                Sign In With Google
              </button>
            </div>
          </div>
        </form>
        <div className="mt-4 text-center">
          <button 
            onClick={() => setIsLogin(!isLogin)}
            className="text-blue-600 hover:underline"
          >
            {isLogin ? "Need an account? Sign Up" : "Already have an account? Login"}
          </button>
        </div>
      </div>
    </div>
  );
}

export default Auth;
