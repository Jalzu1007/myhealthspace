import React, { useState } from 'react'
import { Navigate } from 'react-router-dom';
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import Auth from "../utils/auth";
import { useMutation } from '@apollo/client'; // Import useMutation
import { CREATE_WORKOUT } from '../utils/mutations'; // Import the CREATE_CARDIO_EXERCISE mutation
import cardioIcon from '../images/resistance.png'
import Header from "./Header";
export default function Cardio({onCardioAdded}) {
    const [cardioForm, setCardioForm] = useState({
        type: "cardio",
        name: "",
        distance: "",
        duration: "",
        date: ""
    })
    const [startDate, setStartDate] = useState(new Date());
    const [message, setMessage] = useState("")
    const loggedIn = Auth.loggedIn();
    // Define the CREATE_CARDIO_EXERCISE mutation
  const [createWorkout] = useMutation(CREATE_WORKOUT);
    const handleCardioChange = (event) => {
        const { name, value } = event.target;
        setCardioForm({ ...cardioForm, [name]: value })
    }
    const handleDateChange = date => {
        setStartDate(date);
        handleCardioChange({
            target: { name: "date", value: date }
        })
    }
    const validateForm = (form) => {
        return form.type && form.name && form.distance && form.duration && form.date;
    }
    const handleCardioSubmit = async (event) => {
      event.preventDefault();
      const token = Auth.getToken();
      const userId = Auth.getUserId();
      if (validateForm(cardioForm)) {
        try {
          const { data } = await createWorkout({
            variables: {
              input: {
                type: "cardio",
                name: cardioForm.name,
                distance: parseFloat(cardioForm.distance),
                duration: parseFloat(cardioForm.duration),
                date: cardioForm.date,
              },
            },
          });
          console.log('userId:', userId);
          console.log('token:', token);
          if (data.createWorkout) { // Check for the correct response field
            setMessage('Cardio successfully added!');
            setTimeout(() => {
              setMessage('');
            }, 3000);
            // Pass the cardio data to the parent component
          onCardioAdded(data.createWorkout);
          } else {
            console.error('Cardio exercise creation failed.');
          }
        } catch (err) {
          console.error(err);
        }
      }
      setCardioForm({
        type: "cardio",
        name: "",
        distance: "",
        duration: "",
        date: ""
      });
    };
    if (!loggedIn) {
        return <Navigate to="/login" />;
    }
    return (
        <div className='cardio'>
            <Header />
            <div className="d-flex flex-column align-items-center">
                <h2 className='title text-center'>Add Exercise</h2>
                <form className='cardio-form d-flex flex-column' onSubmit={handleCardioSubmit}>
                    <div className='d-flex justify-content-center'><img alt="cardio" src={cardioIcon} className="exercise-form-icon" /></div>
                    <label >Name:</label>
                    <input type="text" name="name" id="name" placeholder="Running"
                        value={cardioForm.name} onChange={handleCardioChange} />
                    <label >Distance (miles):</label>
                    <input type="number" name="distance" id="distance" placeholder="0"
                        value={cardioForm.distance} onChange={handleCardioChange} />
                    <label >Duration (minutes):</label>
                    <input type="number" name="duration" id="duration" placeholder="0"
                        value={cardioForm.duration} onChange={handleCardioChange} />
                    <label>Date:</label>
                    <DatePicker selected={startDate} value={cardioForm.date} onChange={handleDateChange} placeholderText="mm/dd/yyyy" />
                    <button className='submit-btn cardio-submit-btn' type="submit" disabled={!validateForm(cardioForm)} >Add</button>
                </form>
                <p className='message'>{message}</p>
            </div>
        </div>
    )
}