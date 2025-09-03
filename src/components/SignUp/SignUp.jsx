/* eslint-disable react-hooks/exhaustive-deps */
import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import '../SignIn/AuthForm.css';

const SignUp = (props) => {
  const navigate = useNavigate();

  const initialState = {
    username: '',
    email: '',
    password: '',
    passwordConf: '',
  };

  const [formData, setFormData] = useState(initialState);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (props.user) {
      navigate('/');
    }
  }, [props.user]);

  const handleChange = (evt) => {
    setFormData({ ...formData, [evt.target.name]: evt.target.value });
  };

  const handleSubmit = async (evt) => {
    evt.preventDefault();
    if (formData.password !== formData.passwordConf) {
      setError("Passwords do not match");
      return;
    }
    const result = await props.handleSignUp(formData);
    if (result.success) {
      navigate('/');
    } else {
      setError(result.message);
    }
  };

  const isFormInvalid = !(formData.username && formData.email && formData.password && formData.password === formData.passwordConf);

  return (
    <div className="auth-container">
      <div className="auth-header">
        <h1>Sign Up</h1>
      </div>
      {error && <p className="auth-error">{error}</p>}
      <form onSubmit={handleSubmit} className="auth-form">
        <div className="form-group">
          <label htmlFor="username">Username</label>
          <input type="text" id="username" name="username" onChange={handleChange} className="form-input" required />
        </div>
        <div className="form-group">
          <label htmlFor="email">Email</label>
          <input type="email" id="email" name="email" onChange={handleChange} className="form-input" required />
        </div>
        <div className="form-group">
          <label htmlFor="password">Password</label>
          <input type="password" id="password" name="password" onChange={handleChange} className="form-input" required />
        </div>
        <div className="form-group">
          <label htmlFor="passwordConf">Confirm Password</label>
          <input type="password" id="passwordConf" name="passwordConf" onChange={handleChange} className="form-input" required />
        </div>
        <button type="submit" disabled={isFormInvalid} className="auth-button">
          Sign Up
        </button>
      </form>
      <div className="auth-switch-link">
        <p>
          Already have an account? <Link to="/sign-in">Sign In</Link>
        </p>
      </div>
    </div>
  );
};

export default SignUp;