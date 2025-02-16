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
    <div className="flex flex-col items-center justify-center min-h-screen pattern">
      <h2 className="text-gradient text-4xl mb-10">Create Your Own Top 10 Movies List!</h2>
      <div className="px-8 py-6 mt-4 text-left bg-white shadow-lg rounded-md">
        <h3 className="text-2xl font-bold text-center">
          {isLogin ? "Login" : "Sign Up"}
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
            <div className="flex flex-col items-baseline justify-center mt-4">
              <button
                type="submit"
                className="w-full cursor-pointer px-6 mb-2 py-2 text-white bg-blue-600 rounded-lg hover:bg-blue-900"
              >
                {isLogin ? "Login" : "Sign Up"}
              </button>
              <div className="w-full">
              <button 
                type="button" 
                onClick={signInWithGoogle}
                className="w-full cursor-pointer mb-2 px-6 py-2 text-dark rounded-lg bg-blue-50 hover:bg-blue-200"
              >
                <img className="mx-auto" src="./google-icon.png" alt="google-icon"></img>
                Sign In With Google
              </button>
              </div>
             
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
