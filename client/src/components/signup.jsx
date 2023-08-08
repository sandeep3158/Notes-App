import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom';
const host = 'https://noteapp-chdv.onrender.com';

const signup = (props) => {
  const [credentials, setCredentials] = useState({ name: '', email: '', password: '', cpassword: '' });
  const history = useNavigate(); 
  const handleSubmit = async (e) => {
    e.preventDefault();
    e.persist(); // Persist the event to use it in the asynchronous function.
    const { name, email, password, cpassword } = credentials; // Destructure the values
  
    // Compare password and confirm password
    if (password !== cpassword) {
        props.showAlert('Passwords do not match', 'danger');
        return; // Prevent further execution
    }
    
    const response = await fetch(`${host}/api/auth/createuser`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ name, email, password }),
    });

    const json = await response.json();
    console.log(json)
    if (json.success) {
      // Redirect
      localStorage.setItem('token', json.authtoken);
      history('/');
      props.showAlert('Account Created Successfully','success')
    }
    else{
      props.showAlert('Invalid Credientals','danger')
    }
  };

  const onChange = (e) => {
    const { name, value } = e.target;
    setCredentials((credentials) => ({ ...credentials, [name]: value }));
  };
  return (
    <div>
      <form onSubmit={handleSubmit}>
        <h2>Join NoteApp Today – Create Your Account</h2>
        <div className="mb-3">
          <label htmlFor="name" className="form-label">Name</label>
          <input type="text" className="form-control" id="name" name='name' onChange={onChange} required minLength={3}/>
        </div>
        <div className="mb-3">
          <label htmlFor="name" className="form-label">Email</label>
          <input type="email" className="form-control" id="email" name='email' onChange={onChange} aria-describedby="emailHelp" required />
          <div id="emailHelp" className="form-text">We'll never share your email with anyone else.</div>
        </div>

        <div className="mb-3">
          <label htmlFor="password" className="form-label">Password</label>
          <input type="password" className="form-control" id="password" name='password' onChange={onChange}  minLength={3} required />
        </div>
        <div className="mb-3">
          <label htmlFor="cpassword" className="form-label">Confirm Password</label>
          <input type="password" className="form-control" id="cpassword" name='cpassword' onChange={onChange}  minLength={3} required  />
        </div>
        <button type="submit" className="btn btn-primary">Submit</button>
      </form>
    </div>
  )
}

export default signup
