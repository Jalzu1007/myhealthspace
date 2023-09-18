import React from 'react'
import { Navigate, useNavigate } from 'react-router-dom';
import Auth from "../utils/auth";
import Header from "../components/Header";
import cardioImage from '../images/cardio.png';
import resistanceImage from '../images/resistance.png';
// import backgroundImage from '../image/7.pg'
import { Card } from 'react-bootstrap';

export default function Exercise() {
  const loggedIn = Auth.loggedIn();
  const navigate = useNavigate()

  // If the user is not logged in, redirect to the login page
  if (!loggedIn) {
    return <Navigate to="/login" />;
  }

  return (
    <div>
      <Header />
      <h2 className='title text-center'>Add Exercise</h2>
      <div className="d-flex justify-content-center align-items-center" style={{ height: 'auto' }}>
        <Card className="exercise-card">
          <Card.Body>
            <div>
              <button className='cardio-btn' onClick={() => navigate("/exercise/cardio")}>
                <img alt="cardio" src={cardioImage} className="exercise-icon" />
                Cardio
              </button>
            </div>
            <div>
              <button className='resistance-btn' onClick={() => navigate("/exercise/resistance")}>
                <img alt="resistance" src={resistanceImage} className="exercise-icon" />
                Resistance
              </button>
            </div>
          </Card.Body>
        </Card>
      </div>
    </div>
  );
}
