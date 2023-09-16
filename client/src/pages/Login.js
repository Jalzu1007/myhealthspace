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
    <div>
      <Header/>
    <div className="signup-container d-flex flex-column align-items-center justify-content-center">
      <Card className="signup-card">
        <Card.Body>
          
          <form onSubmit={handleFormSubmit} className="signup-form d-flex flex-column">
          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
              className="form-input"
              value={formState.email}
              placeholder="youremail@gmail.com"
              name="email"
              type="email"
              onChange={handleChange}
            />
            </div>
            
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
                disabled={!(formState.email && formState.password)}
                className="signup-btn mx-auto my-auto"
              >
                Login
              </button>
            </div>

            <p className="link-btn">
              New to myhealthspace?{' '}
              <Link to="/signup">Create one</Link>
            </p>
            {showAlert && <div className="err-message">Login failed</div>}
          </form>
        </Card.Body>
      </Card>
    </div>
    </div>
  );
}

