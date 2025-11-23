import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { loginUser } from '../../../Backend/Controllers/LoginController';

function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');

    try {
      const data = await loginUser(username, password);
      console.log('Login successful', data);
      navigate('/hero');
    } catch (error) {
      setError(error.message);
    }
  };

  return (
    <div className="flex h-screen">
      <div 
        className="w-3/5 bg-cover bg-center" 
        style={{ backgroundImage: "url('/path/to/your/image.jpg')" }} 
      />
      <div className="w-2/5 flex items-center justify-center flex-col p-8" style={{ backgroundColor: '#312f2f' }}>
        <h2 className="mb-4 text-2xl font-bold text-white text-center">Login</h2>
      
        {error && <p className="mb-4 text-red-500 text-center">{error}</p>}

        <form className="flex flex-col" onSubmit={handleLogin}>
          <input 
            type="text" 
            placeholder="Username or Email" 
            value={username}
            onChange={(e) => setUsername(e.target.value.trim())}
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
            className="p-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Login
          </button>
        </form>

        <p className="mt-4 text-center text-white">
          Don't have an account?{" "}
          <Link to="/register" className="underline">Register</Link>
        </p>
      </div>
    </div>
  );
}

export default Login;