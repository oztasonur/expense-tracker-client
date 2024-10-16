import React, { useState } from 'react';
import Login from './Login';
import Signup from './Signup';

const LandingPage = () => {
  const [showLogin, setShowLogin] = useState(true);

  return (
    <div className="landing-page">
      <h1>Expense Tracker</h1>
      <p className="subtitle">Manage your expenses with ease</p>
      <div className="auth-container">
        {showLogin ? <Login /> : <Signup />}
        <p>
          {showLogin ? "Don't have an account? " : "Already have an account? "}
          <button onClick={() => setShowLogin(!showLogin)}>
            {showLogin ? "Sign up now" : "Log in here"}
          </button>
        </p>
      </div>
    </div>
  );
};

export default LandingPage;

