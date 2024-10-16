import React, { useState } from 'react';

const Signup = () => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    // TODO: Implement signup logic
    console.log('Signup submitted', { username, email, password });
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2>Sign Up</h2>
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
          type="email"
          id="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder=" "
          required
        />
        <label htmlFor="email">Email</label>
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
      <button type="submit">Sign Up</button>
    </form>
  );
};

export default Signup;
