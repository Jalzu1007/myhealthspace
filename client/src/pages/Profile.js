import React, { useState, useEffect } from 'react';
import { Navigate, Link } from 'react-router-dom';
import { QUERY_USER } from '../utils/queries';
import Auth from '../utils/auth';
import { formatDate } from '../utils/dateFormat';
import Header from '../components/Header';
import cardioImage from '../images/cardio.png';
import resistanceImage from '../images/resistance.png';
import { useQuery } from '@apollo/client';

export default function Profile() {
  const [userData, setUserData] = useState({});
  const [exerciseData, setExerciseData] = useState([]);
  const [displayedItems, setDisplayedItems] = useState(6);
  const [cardioData, setCardioData] = useState([]);
  const [workouts, setWorkouts] = useState([]); // Define workouts as a state variable

  const loggedIn = Auth.loggedIn();
  console.log(exerciseData);
  console.log(displayedItems);
  let currentDate;
  //get token
  const _id = loggedIn ? Auth.getProfile().data._id : null;

  const { loading, data } = useQuery(QUERY_USER, {
    variables: { _id: _id },
  });

  useEffect(() => {
    if (loading) return; // Add return statement here to handle loading

    const userWorkouts = data?.getUser.savedWorkouts || { cardio: null, resistance: null };
    console.log(userWorkouts);
    if (userWorkouts.cardio && userWorkouts.resistance) {
      const cardio = userWorkouts.cardio;
      const resistance = userWorkouts.resistance;
      const exercise = cardio.concat(resistance);

      // Sort exercises by date
      exercise.sort((a, b) => {
        return new Date(b.date) - new Date(a.date);
      });

      // Format date in exercise data
      exercise.forEach((item) => {
        item.date = formatDate(item.date);
      });

      setUserData(userWorkouts);
      setExerciseData(exercise);
      setCardioData(cardio); // Update cardioData state with cardio workouts
      setWorkouts(exercise); // Set the workouts state variable
    }
  }, [loading, data]);

  function showMoreItems() {
    setDisplayedItems(displayedItems + 6);
  }

  // If the user is not logged in, redirect to the login page
  if (!loggedIn) {
    return <Navigate to="/login" />;
  }

  return (
    <div className="history">
      <Header />
      <div className="d-flex flex-column align-items-center">
        <h2 className='title'>History</h2>
        {workouts.length ?
          (<div className='history-data'>
            {/* map the exercise data  */}
            {workouts.slice(0, displayedItems).map((exercise) => {
              let dateToDisplay;
              if (exercise.date !== currentDate) {
                currentDate = exercise.date;
                dateToDisplay = exercise.date;
              }
              return (
                <div className="history-div d-flex" key={exercise._id}>
                  <div className="date d-flex align-items-center">{dateToDisplay}</div>
                  <div className="exercise-details">
                    <p>Type: {exercise.type}</p>
                    <p>Name: {exercise.name}</p>
                    {/* Add more details as needed */}
                  </div>
                </div>
              );
            })}
            {/* Show more items */}
            {exerciseData.length > displayedItems ? (
              <div className="d-flex justify-content-center">
                <button className="show-btn" onClick={showMoreItems}>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="#000000"
                    strokeWidth="2"
                    strokeLinejoin="round"
                  >
                    <path d="M6 9l6 6 6-6" />
                  </svg>
                  Show More
                </button>
              </div>
            ) : null}
          </div>
        ) : (
          <div>
            <h3 className="history-text">No exercise data yet...</h3>
            <Link to="/exercise">
              <button className="home-btn">Add Exercise</button>
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
