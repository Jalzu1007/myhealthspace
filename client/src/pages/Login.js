import React, { useState } from "react";
import { Link, Navigate } from "react-router-dom";
import Auth from "../utils/auth";
import Header from "../components/Header";
//  Import the neccessary Apollo Client dependencies
import { useMutation } from "@apollo/client";
import { LOGIN_USER } from "../utils/mutations";


export default function Login() {
    const [formState, setFormState] = useState({ email: "", password: "" });
    const [showAlert, setShowAlert] = useState(false);
  
    const loggedIn = Auth.loggedIn();

    // Use the useMutation hook to create the loginUserMutation function
  const [loginUserMutation, { error }] = useMutation(LOGIN_USER);


    // update state based on form input changes
  const handleChange = (event) => {
    const { name, value } = event.target;

    setFormState({
        ...formState,
        [name]: value,
      });
    };
  
    // submit form
  const handleFormSubmit = async (event) => {
    event.preventDefault();

    // check the response
    try {
        const { data } = await loginUserMutation({
          variables: { ...formState },
        });
  
        // Check if the login was successful
        if (data.loginUser.token) {
          const token = data.loginUser.token;
          Auth.login(token);
          console.log(data.loginUser.user);
        } else {
          // Handle login error here, if needed
        }
      } catch (err) {
        console.error(err);
        setShowAlert(true);
      }
  
      setFormState({
        email: "",
        password: "",
      });
    };

    // If the user is logged in, redirect to the home page
  if (loggedIn) {
    return <Navigate to="/" />;
  }

  return (
    <div className="signup d-flex flex-column align-items-center justify-content-center text-center">
      <Header />
      <form onSubmit={handleFormSubmit} className="signup-form d-flex flex-column">
        {/* --------------------email-------------------- */}
        <label htmlFor="email">Email</label>
        <input
          className="form-input"
          value={formState.email}
          placeholder="youremail@gmail.com"
          name="email"
          type="email"
          onChange={handleChange}
        />

        {/* -------------------- password-------------------- */}
        <label htmlFor="password">Password</label>
        <input
          className="form-input"
          value={formState.password}
          placeholder="********"
          name="password"
          type="password"
          onChange={handleChange}
        />

        {/* --------------------login btn-------------------- */}
        <div className="btn-div">
          <button disabled={!(formState.email && formState.password)}
            className="signup-btn mx-auto my-auto">Login</button>
        </div>
        {/* --------------------signup link-------------------- */}
        <p className="link-btn">
          New to myhealthspace?{' '}
          <Link to="/signup" >Create one</Link>
        </p>
        {showAlert && <div className="err-message">Login failed</div>}
      </form>
    </div>
  );
}