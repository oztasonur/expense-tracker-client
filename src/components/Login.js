import React, { useState } from 'react';

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    // TODO: Implement login logic
    console.log('Login submitted', { username, password });
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2>Login</h2>
      <div className="form-group">
        <input
          type="text"
          id="username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          placeholder=" "
          required
        />
        <label htmlFor="username">Username</label>
      </div>
      <div className="form-group">
        <input
          type="password"
          id="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder=" "
          required
        />
        <label htmlFor="password">Password</label>
      </div>
      <button type="submit">Log In</button>
    </form>
  );
};

export default Login;
