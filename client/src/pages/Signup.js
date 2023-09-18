import React, { useState } from "react";
import { Link, Navigate } from "react-router-dom";
import Auth from "../utils/auth";
import { useMutation } from '@apollo/client';
import { CREATE_USER } from '../utils/mutations';
import Header from "../components/Header";

export default function Signup() {
  const loggedIn = Auth.loggedIn();

  const [formState, setFormState] = useState({
    username: "",
    email: "",
    password: "",
  });

  const [showAlert, setShowAlert] = useState(false);
  const [createUserMutation, { error }] = useMutation(CREATE_USER);

  const handleChange = (event) => {
    const { name, value } = event.target;

    setFormState({
      ...formState,
      [name]: value,
    });
  };

  const handleFormSubmit = async (event) => {
    event.preventDefault();

    try {
      const { data } = await createUserMutation({
        variables: {
          username: formState.username,
          email: formState.email,
          password: formState.password,
        },
      });

      const { token, user } = data.createUser;
      Auth.login(token);
    } catch (err) {
      console.error(err);
      setShowAlert(true);
    }
  };

  if (loggedIn) {
    return <Navigate to="/" />;
  }

  return (
    <div className="signup-container">
      <div className="card">
    
      <div className="card-body">
        <Header/>
          {/* <h5 className="card-title">myhealthspace</h5> */}
          <p className="card-text">Welcome! Please sign up to get started.</p>
      </div>
    
    <form onSubmit={handleFormSubmit} className="signup-form d-flex flex-column">

      {/* --------------------username-------------------- */}
      <div className="mb-3">
        <label htmlFor="username" className="form-label">Username</label>
        <input
          type="text"
          className="form-control"
          id="username"
          placeholder="Your username"
          name="username"
          value={formState.username}
          onChange={handleChange}
        />
      </div>

      {/* --------------------email-------------------- */}
      <div className="mb-3">
        <label htmlFor="email" className="form-label">Email</label>
        <input
          type="email"
          className="form-control"
          id="email"
          placeholder="email@example.com"
          name="email"
          value={formState.email}
          onChange={handleChange}
        />
      </div>

      {/* -------------------- password-------------------- */}
      <div className="mb-3">
        <label htmlFor="password" className="form-label">Password</label>
        <input
          type="password"
          className="form-control"
          id="password"
          placeholder="********"
          name="password"
          value={formState.password}
          onChange={handleChange}
        />
      </div>

      {/* --------------------sign up btn-------------------- */}
      <div className="mb-3 d-grid gap-2 col-6 mx-auto">
        <button
          type="submit"
          disabled={!(formState.username && formState.email && formState.password)}
          className="btn btn-warning"
        >
          Sign Up
        </button>
      </div>

      {/* --------------------login link-------------------- */}
      <p className="link-btn">
        Already have an account?{' '}
        <Link to="/login">Log in</Link>
      </p>

      {showAlert && <div className="err-message">Signup failed</div>}
    </form>
    </div>
    </div>
  );
}
