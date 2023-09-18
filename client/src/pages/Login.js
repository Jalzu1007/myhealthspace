import React, { useState } from "react";
import { Link, Navigate } from "react-router-dom";
import Auth from "../utils/auth";
import Header from "../components/Header";
import { useMutation } from "@apollo/client";
import { LOGIN_USER } from "../utils/mutations";
import { Card } from 'react-bootstrap';

export default function Login() {
  const [formState, setFormState] = useState({ email: "", password: "" });
  const [showAlert, setShowAlert] = useState(false);
  const loggedIn = Auth.loggedIn();

  const [loginUserMutation, { error }] = useMutation(LOGIN_USER);

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
      const { data } = await loginUserMutation({
        variables: {
          email: formState.email,
          password: formState.password,
        },
      });

      const { token, user } = data.login;
      Auth.login(token);
    } catch (err) {
      console.error(err);
      setShowAlert(true);
    }

    setFormState({
      email: '',
      password: '',
    });
  };

  if (loggedIn) {
    return <Navigate to="/" />;
  }

  return (
    <div className="signup-container">
      <div className="card custom-card"> {/* Apply custom card class */}
        <div className="card-body">
          <Header />
          <p className="card-text">Welcome! Please log in to continue.</p>
        </div>

        <form onSubmit={handleFormSubmit} className="signup-form d-flex flex-column">
          {/* Email */}
          <div className="mb-3">
            <label htmlFor="email" className="form-label">Email</label>
            <input
              type="email"
              className="form-control"
              id="email"
              placeholder="youremail@gmail.com"
              name="email"
              value={formState.email}
              onChange={handleChange}
            />
          </div>

          {/* Password */}
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

          {/* Sign in button */}
          <div className="mb-3 d-grid gap-2 col-6 mx-auto">
            <button
              type="submit"
              disabled={!(formState.email && formState.password)}
              className="btn btn-warning"
            >
              Login
            </button>
          </div>

          {/* Sign up link */}
          <p className="link-btn">
            New to myhealthspace?{' '}
            <Link to="/signup">Create one</Link>
          </p>

          {showAlert && <div className="err-message">Login failed</div>}
        </form>
      </div>
    </div>
  );
}
