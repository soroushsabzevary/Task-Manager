import React, { useEffect, useState } from 'react';
import './SignIn.css';
import {auth, provider} from '../../ES6dbConfig.js';
import {signInWithPopup} from 'firebase/auth';

function SignIn() {
  //const [value, setValue] = useState('');
  const googleAuth = async () => {
    try {
      const data = await signInWithPopup(auth, provider); 
      const token = await data.user.getIdToken(); 
      console.log(typeof token); 
      //setValue(data.user.email);
      login(token, data.user.email);
    } catch (err) {
      console.error("Error during sign-in:", err); 
    }
  };
  const login = async (token, email) => {
   //console.log(token); 
    const response = await fetch('/signin', {
      method: 'POST', 
      headers: {
        'Content-Type': 'application/json', 
      },
      body: JSON.stringify({token : token, email: email})
    });
    const data = await response.json();
    console.log(data.auth)
    if(data.auth){
      window.location.href = 'dashboard';
    }
  }

  /*useEffect(()=>{
    console.log("hi" + value);
  }, [value])*/
    //{value?<dashrboard/>:}
  return (
    <div className="sign-in-container">
      <h1>Welcome to Your Task Manage</h1>
      <p>Sign in using your Google account.</p>
      <button className="google-sign-in" onClick={googleAuth}>
        Login/Signup with Google
      </button>
    </div>
  );
}
export default SignIn
