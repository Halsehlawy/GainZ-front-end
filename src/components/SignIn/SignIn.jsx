/* eslint-disable react-hooks/exhaustive-deps */
import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import './AuthForm.css';

const SignIn = (props) => {
  const navigate = useNavigate();

  const initialState = {
    username: '',
    password: '',
  };

  const [formData, setFormData] = useState(initialState);

  useEffect(() => {
    if (props.user) {
      navigate('/');
    }
  }, [props.user]);

  const handleChange = (evt) => {
    setFormData({ ...formData, [evt.target.name]: evt.target.value });
  };

  const handleSubmit = (evt) => {
    evt.preventDefault();
    props.handleSignIn(formData);
    navigate('/');
  };

  return (
    <div className="auth-container">
      <div className="auth-header">
        <h1>Sign In</h1>
      </div>
      <form onSubmit={handleSubmit} className="auth-form">
        <div className="form-group">
          <label htmlFor="username">Username</label>
          <input
            type="text"
            id="username"
            name="username"
            onChange={handleChange}
            className="form-input"
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="password">Password</label>
          <input
            type="password"
            id="password"
            name="password"
            onChange={handleChange}
            className="form-input"
            required
          />
        </div>
        <button type="submit" className="auth-button">
          Sign In
        </button>
      </form>
      <div className="auth-switch-link">
        <p>
          Don't have an account? <Link to="/sign-up">Sign Up</Link>
        </p>
      </div>
    </div>
  );
};

export default SignIn;