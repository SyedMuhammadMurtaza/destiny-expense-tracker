// Frontend/src/components/Login.js
import React, { useState } from "react";

const Login = ({ onLogin }) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const hardcodedCredentials = {
    username: "destiny",
    password: "password123",
  };

  const handleLogin = (e) => {
    e.preventDefault();
    if (username === hardcodedCredentials.username && password === hardcodedCredentials.password) {
      onLogin(true); // Notify parent component of successful login
      alert("Login successful!");
    } else {
      alert("Invalid username or password.");
    }
  };

  return (
    <div className="w-full flex items-center justify-center h-screen bg-gray-700">
      <form onSubmit={handleLogin} className="bg-white p-6 rounded shadow-md">
        <h1 className="text-2xl font-bold mb-4">Login</h1>
        <div className="mb-4">
          <label className="block text-gray-700">Username</label>
          <input
            type="text"
            className="w-full px-3 py-2 border rounded"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700">Password</label>
          <input
            type="password"
            className="w-full px-3 py-2 border rounded"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        <button
          type="submit"
          className="w-full px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          Login
        </button>
      </form>
     
    </div>
  );
};

export default Login;
