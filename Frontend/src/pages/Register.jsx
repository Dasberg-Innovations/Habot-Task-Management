import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { signupUser } from '../../../Backend/Controllers/LoginController'; 
import DesktopImage from '../../src/assets/Landing_Page.jpg';

function Register() {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    setError('');

    try {
      const data = await signupUser(username, email, password);
      console.log('Registration successful', data);
      navigate('/login');
    } catch (error) {
      setError(error.message);
    }
  };

  return (
    <div className="flex h-screen">
      <div className="flex-1 bg-cover bg-center" style={{ backgroundImage: `url(${DesktopImage})` }} />
      
      <div className="flex items-center justify-center flex-col w-full max-w-md p-8 bg-white shadow-md">
        <h2 className="mb-4 text-2xl font-bold text-center">Register</h2>
      
        {error && <p className="mb-4 text-red-500 text-center">{error}</p>}

        <form className="flex flex-col" onSubmit={handleRegister}>
          <input 
            type="text" 
            placeholder="Username" 
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="p-2 mb-4 border border-gray-300 rounded" 
            required
          />
          <input 
            type="email" 
            placeholder="Email" 
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="p-2 mb-4 border border-gray-300 rounded" 
            required
          />
          <input 
            type="password" 
            placeholder="Password" 
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="p-2 mb-4 border border-gray-300 rounded" 
            required
          />
          
          <button 
            type="submit" 
            className="p-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            Create Account
          </button>
        </form>

        <p className="mt-4 text-center">
          Already have an account?{" "}
          <Link to="/login" className="text-blue-500 hover:underline">Login</Link>
        </p>
      </div>
    </div>
  );
}

export default Register;