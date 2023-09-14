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
    <div>
    <Header />
    <div className="signup-container d-flex flex-column align-items-center justify-content-center">
      <Card className="signup-card">
        <Card.Body>
          
          <form onSubmit={handleFormSubmit} className="signup-form d-flex flex-column">
            <label htmlFor="username">Username</label>
            <input
              className="form-input"
              value={formState.username}
              placeholder="Your username"
              name="username"
              type="text"
              onChange={handleChange}
            />

            <label htmlFor="email">Email</label>
            <input
              className="form-input"
              value={formState.email}
              placeholder="youremail@gmail.com"
              name="email"
              type="email"
              onChange={handleChange}
            />

            <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              className="form-input"
              value={formState.password}
              placeholder="********"
              name="password"
              type="password"
              onChange={handleChange}
            />
            </div>

            <div className="btn-div">
              <button
                disabled={!(formState.username && formState.email && formState.password)}
                className="signup-btn mx-auto my-auto"
              >
                Sign Up
              </button>
            </div>

            <p className="link-btn">
              Already have an account?{' '}
              <Link to="/login">Log in</Link>
            </p>
            {showAlert && <div className="err-message">Signup failed</div>}
          </form>
        </Card.Body>
      </Card>
    </div>
    </div>
  );
}
