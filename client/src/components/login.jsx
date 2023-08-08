// src/Login.jsx
import React, { useState } from 'react';
import  {useNavigate}  from 'react-router-dom';

const host = 'https://noteapp-chdv.onrender.com';

const Login = (props) => {
  const [credentials, setCredentials] = useState({ email: '', password: '' });
  const history = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    e.persist(); // Persist the event to use it in the asynchronous function.

    const response = await fetch(`${host}/api/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email: credentials.email, password: credentials.password }),
    });

    const json = await response.json();
      console.log(json)
    if (json.success) {
      // Redirect
      localStorage.setItem("token", json.authToken);

      history('/');
      props.showAlert('Logged in Successfully','success')
    } else {
     props.showAlert('Invalid crediental','danger')
    }
  };

  const onChange = (e) => {
    const { name, value } = e.target;
    setCredentials((credentials) => ({ ...credentials, [name]: value }));
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2>Welcome back to NoteApp – Please Log In</h2>
      <div className="mb-3">
        <label htmlFor="email" className="form-label">
          Email
        </label>
        <input type="email" className="form-control" id="email" name="email" value={credentials.email} onChange={onChange} required />
      </div>
      <div className="mb-3">
        <label htmlFor="password" className="form-label">
          Password
        </label>
        <input type="password" className="form-control" id="password" name="password" onChange={onChange} value={credentials.password} required />
      </div>
      <button type="submit" className="btn btn-primary">
        Submit
      </button>
    </form>
  );
};

export default Login;
