import React, { useState } from 'react'
import { Navigate } from 'react-router-dom';
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import Auth from "../utils/auth";
import Header from "./Header";
import resistanceIcon from "../images/resistance.png"
import { useMutation } from '@apollo/client';
import { CREATE_WORKOUT } from '../utils/mutations'; 
import { QUERY_USER } from '../utils/queries'; 

export default function Resistance({onResistanceAdded}) {
    const [resistanceForm, setResistanceForm] = useState({
        type: "resistance",
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
    // Define the CREATE_RESISTANCE_EXERCISE mutation
    const [createWorkout] = useMutation(CREATE_WORKOUT, {refetchQueries: [{ query: QUERY_USER }]});

    const handleResistanceChange = (event) => {
        const { name, value } = event.target;
        setResistanceForm({ ...resistanceForm, [name]: value })
    }
    // Function to handle date changes
    const handleDateChange = date => {
        setStartDate(date);
        handleResistanceChange({
            target: { name: "date", value: date }
        })
    }
    // Function to validate the form
    const validateForm = (form) => {
        return form.type && form.name && form.weight && form.sets && form.reps && form.date;
    }
    // Function to handle resistance exercise submission
    const handleResistanceSubmit = async (event) => {
        event.preventDefault();
        const token = Auth.getToken();
        // Get the user's ID
        const userId = Auth.getUserId();
        // If the form is valid, proceed
        if (validateForm(resistanceForm)) {
            try {
                const { data } = await createWorkout({
                  variables: {
                    input: {
                        type: "resistance",
                        name: resistanceForm.name,
                        weight: parseFloat(resistanceForm.weight),
                        sets: parseFloat(resistanceForm.sets),
                        reps:parseFloat(resistanceForm.reps),
                        date: resistanceForm.date,
                    },
                  },
                });
                console.log('userId:', userId);
                console.log('token:', token);
                // Clear the message after 3 seconds
                if (data.createWorkout) {
                    setMessage('Resistance successfully added!');
                    setTimeout(() => {
                      setMessage('');
                    }, 3000);
                    // Pass the cardio data to the parent component
                    onResistanceAdded(data.createWorkout);
                } else {
                    // Handle server validation errors here
                    const errorMessages = data.errors.map(error => error.message);
                    console.error('Server validation errors:', errorMessages);
                  }
                } catch (err) {
                  console.error(err);
                }
              }
        // Clear the form input
        setResistanceForm({
            type: "resistance",
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
        <div className='resistance'> 
            <Header /> 
            <div className="d-flex flex-column align-items-center"> 
                <h2 className='title text-center'>Add Exercise</h2> 
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
                    <p className='message'>{message}</p> {/* Display a success/error message */}
                </form>
            </div>
        </div>
    )
}
