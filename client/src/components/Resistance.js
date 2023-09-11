import React, { useState } from 'react'
import { Navigate } from 'react-router-dom';
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import Auth from "../utils/auth";
import { createResistance } from '../utils/API';
// Import Header/Navbar
import Header from "./Header";
import resistanceIcon from "../../public/images/weightlifting.png"

export default function Resistance() {
    // Initialize state variables using useState hook
    const [resistanceForm, setResistanceForm] = useState({
        name: "",
        weight: "",
        sets: "",
        reps: "",
        date: ""
    })
    const [startDate, setStartDate] = useState(new Date());
    const [message, setMessage] = useState("");
    // Check if the user is logged in using Auth.loggedIn()
    const loggedIn = Auth.loggedIn();
    
    // Function to handle date changes
    const handleDateChange = date => {
        setStartDate(date);
        handleResistanceChange({
            target: { name: "date", value: date }
        })
    }

    // Function to validate the form
    const validateForm = (form) => {
        return form.name && form.weight && form.sets && form.reps && form.date;
    }

    // Function to handle resistance exercise submission
    const handleResistanceSubmit = async (event) => {
        event.preventDefault();
        // Get the user's token
        const token = loggedIn ? Auth.getToken() : null;
        // If there's no token, return early
        if (!token) return false;

        // Get the user's ID
        const userId = Auth.getUserId();

        // If the form is valid, proceed
        if (validateForm(resistanceForm)) {
            try {
                // Add the user ID to the resistance form
                resistanceForm.userId = userId;

                // Send a request to create a resistance exercise using the API
                const response = await createResistance(resistanceForm, token);

                // Check if the request was successful
                if (!response.ok) {
                    throw new Error('Oops! Something went wrong.');
                }

                // Clear the message after 3 seconds
                setMessage("Resistance exercise successfully created!")
                setTimeout(() => {
                    setMessage("")
                }, 3000);

            } catch (err) {
                console.error(err)
            }
        }

        // Clear the form input
        setResistanceForm({
            name: "",
            weight: "",
            sets: "",
            reps: "",
            date: ""
        });
    }
    // If the user is not logged in, redirect to the login page
    if (!loggedIn) {
        return <Navigate to="/login" />;
    }

    // Render the Resistance component
    return (
        <div className='resistance'> {/* Outer container */}
            <Header /> {/* Render the Header component */}
            <div className="d-flex flex-column align-items-center"> {/* Container for the main content */}
                <h2 className='title text-center'>Add Exercise</h2> {/* Title */}
                <form className='resistance-form d-flex flex-column' onSubmit={handleResistanceSubmit}>
                    {/* Form for adding resistance exercise */}
                    <div className='d-flex justify-content-center'>
                        {/* Container for centering the weightlifting image */}
                        <img alt="resistance" src={resistanceIcon} className="exercise-form-icon" />
                    </div>
                    <label>Name:</label>
                    <input
                        type="text"
                        name="name"
                        id="name"
                        placeholder="Bench Press"
                        value={resistanceForm.name}
                        onChange={handleResistanceChange}
                    />
                    <label>Weight (lbs):</label>
                    <input
                        type="number"
                        name="weight"
                        id="weight"
                        placeholder="0"
                        value={resistanceForm.weight}
                        onChange={handleResistanceChange}
                    />
                    <label>Sets:</label>
                    <input
                        type="number"
                        name="sets"
                        id="sets"
                        placeholder="0"
                        value={resistanceForm.sets}
                        onChange={handleResistanceChange}
                    />
                    <label>Reps:</label>
                    <input
                        type="number"
                        name="reps"
                        id="reps"
                        placeholder="0"
                        value={resistanceForm.reps}
                        onChange={handleResistanceChange}
                    />
                    <label>Date:</label>
                    <DatePicker
                        selected={startDate}
                        value={resistanceForm.date}
                        onChange={handleDateChange}
                        placeholderText="mm/dd/yyyy"
                    />
                    <button className='submit-btn' type="submit" disabled={!validateForm(resistanceForm)}>Add</button> {/* Submit button */}
                </form>
                <p className='message'>{message}</p> {/* Display a success/error message */}
            </div>
        </div>
    )
}