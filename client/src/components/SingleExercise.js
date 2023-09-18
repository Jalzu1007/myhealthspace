import React, { useState, useEffect } from 'react';
import { useParams, Navigate, useNavigate } from 'react-router-dom';
import { confirmAlert } from "react-confirm-alert";
import "react-confirm-alert/src/react-confirm-alert.css";
import { useMutation, useQuery } from '@apollo/client';
import Auth from '../utils/auth';
import { formatDate } from '../utils/dateFormat';
import Header from "./Header";
import cardioIcon from "../images/cardio.png"
import resistanceIcon from "../images/resistance.png"
import { DELETE_WORKOUT} from '../utils/mutations';
import { UPDATE_WORKOUT } from '../utils/mutations';
import { QUERY_USER } from '../utils/queries';

export default function SingleExercise() {
    const { id, type } = useParams();
    const [cardioData, setCardioData] = useState({})
    const [resistanceData, setResistanceData] = useState({})
    const { loading, error, data } =useQuery(QUERY_USER);
    const [isUpdateFormVisible, setUpdateFormVisible] = useState(false);
    const [updatedWorkoutData, setUpdatedWorkoutData] = useState({});
    const [updateWorkout] = useMutation(UPDATE_WORKOUT);

    useEffect(() => {
      if (type === 'cardio') {
        
        setUpdatedWorkoutData({
          name: cardioData.name, 
          date: cardioData.date,
          distance: cardioData.distance,
          duration: cardioData.duration, 
        });
      } else if (type === 'resistance') {
       
        setUpdatedWorkoutData({
          name: resistanceData.name, 
          date: resistanceData.date,
          weight: resistanceData.weight,
          sets: resistanceData.sets, 
          reps: resistanceData.reps, 
        });
      }
    }, [type, cardioData, resistanceData]);

    const loggedIn = Auth.loggedIn();
    const navigate = useNavigate()

    // UPDATE
    const toggleUpdateForm = () => {
      setUpdateFormVisible(!isUpdateFormVisible);
    };
    
    const handleUpdateSubmit = async (e) => {
      e.preventDefault();
    
      const updatedWorkoutDataWithFloats = {
        ...updatedWorkoutData,
        distance: parseFloat(updatedWorkoutData.distance),
        duration: parseFloat(updatedWorkoutData.duration),
        sets: parseInt(updatedWorkoutData.sets),
        reps: parseInt(updatedWorkoutData.reps),
        weight: parseFloat(updatedWorkoutData.weight),
        type: type || '',
      };

      try {
        const { data } = await updateWorkout({
          variables: {
            id,
            input: updatedWorkoutDataWithFloats,
            type,
          },
        });
        console.log('Type:', type);
        console.log('Mutation data:', data);

        if (data.updateWorkout) {
       
          console.log('Workout updated successfully');
          navigate(`/profile`);
        } else {
          console.error('Failed to update workout');
        }
      } catch (error) {
        console.error('Error updating workout', error);
      }
    };

    // Define the DELETE_EXERCISE mutation
    const [deleteWorkout] = useMutation(DELETE_WORKOUT);
    
    useEffect(() => {
      if (data && data.getUser) {
        const savedCardioWorkout = data.getUser.savedWorkouts.find(
          (workout) => workout._id === id && workout.type === 'cardio'
        );
  
        if (savedCardioWorkout) {
          const cardio = {
            _id: savedCardioWorkout._id,
            type: "cardio",
            name: savedCardioWorkout.name,
            distance: savedCardioWorkout.distance,
            duration: savedCardioWorkout.duration,
            date: savedCardioWorkout.date,
          };
          cardio.date = formatDate(cardio.date);
  
          setCardioData(cardio);
        }
      };
    }, [data, id]);

    useEffect(() => {
      if (data && data.getUser) {
        const savedResistanceWorkout = data.getUser.savedWorkouts.find(
          (workout) => workout._id === id && workout.type === 'resistance'
        );
  
        if (savedResistanceWorkout) {
          const resistance = {
            _id: savedResistanceWorkout._id,
            type: "resistance",
            name: savedResistanceWorkout.name,
            weight: savedResistanceWorkout.weight,
            sets: savedResistanceWorkout.sets,
            reps: savedResistanceWorkout.reps,
            date: savedResistanceWorkout.date,
          };
          resistance.date = formatDate(resistance.date);
  
          setResistanceData(resistance);
        }
      };
    }, [data, id]);

    const handleDeleteWorkout = async () => {
        const token = loggedIn ? Auth.getToken() : null;
      
        if (!token) {
          // Handle the case where the user is not logged in
          return;
        }
      
        confirmAlert({
          title: "Delete Exercise",
          message: "Are you sure you want to delete this exercise?",
          buttons: [
            {
              label: "Cancel",
            },
            {
              label: "Delete",
              onClick: async () => {
                try {
                  // Execute the DELETE_WORKOUT mutation with the workout ID
                  const { data } = await deleteWorkout({
                    variables: { id },
                    update: (cache) => {
                      const { getUser } = cache.readQuery({ query: QUERY_USER });
                      const updatedWorkouts = getUser.savedWorkouts.filter(
                        (workout) => workout._id !== id
                      );
                      cache.writeQuery({
                        query: QUERY_USER,
                        data: {
                          getUser: {
                            ...getUser,
                            savedWorkouts: updatedWorkouts,
                          },
                        },
                      });
                    },
                  });
      
                  // Check the response to see if the workout was successfully deleted
                  if (data.deleteWorkout) {
                    // Handle success, e.g., update the UI or navigate back to the history
                    console.log('Workout deleted successfully');
                    navigate("/profile");
                  } else {
                    // Handle failure, e.g., show an error message
                    console.error('Failed to delete workout');
                  }
                } catch (error) {
                  // Handle any errors that occur during the mutation
                  console.error('Error deleting workout', error);
                }
              },
            },
          ],
        });
      };

return (
  <div className={type === "cardio" ? "single-cardio" : "single-resistance"}>
    <Header />
    <h2 className='title text-center'>History</h2>
    <div className="single-exercise d-flex flex-column align-items-center text-center">
      {isUpdateFormVisible ? (
        <form class="update-form" onSubmit={handleUpdateSubmit}>
          <label>Date:</label>
          <input
            type="date"
            placeholder="Updated Date"
            value={updatedWorkoutData.date}
            onChange={(e) =>
              setUpdatedWorkoutData({
                ...updatedWorkoutData,
                date: e.target.value,
              })
            }
          />
          <label >Name:</label>
          <input
            type="text"
            placeholder="Updated Name"
            value={updatedWorkoutData.name}
            onChange={(e) =>
              setUpdatedWorkoutData({
                ...updatedWorkoutData,
                name: e.target.value,
              })
            }
          />
          {type === "cardio" && (
            <>
            <label >Distance (miles):</label>
              <input
                type="number"
                placeholder="Updated Distance (miles)"
                value={updatedWorkoutData.distance}
                onChange={(e) =>
                  setUpdatedWorkoutData({
                    ...updatedWorkoutData,
                    distance: e.target.value,
                  })
                }
              />
              <label >Duration (minutes):</label>
              <input
                type="number"
                placeholder="Updated Duration (minutes)"
                value={updatedWorkoutData.duration}
                onChange={(e) =>
                  setUpdatedWorkoutData({
                    ...updatedWorkoutData,
                    duration: e.target.value,
                  })
                }
              />
            </>
          )}
          {type === "resistance" && (
            <>
            <label>Weight (lbs):</label>
              <input
                type="number"
                placeholder="Updated Weight (lbs)"
                value={updatedWorkoutData.weight}
                onChange={(e) =>
                  setUpdatedWorkoutData({
                    ...updatedWorkoutData,
                    weight: e.target.value,
                  })
                }
              />
               <label>Sets:</label>
              <input
                type="number"
                placeholder="Updated Sets"
                value={updatedWorkoutData.sets}
                onChange={(e) =>
                  setUpdatedWorkoutData({
                    ...updatedWorkoutData,
                    sets: e.target.value,
                  })
                }
              />
              <label>Reps:</label>
              <input
                type="number"
                placeholder="Updated Reps"
                value={updatedWorkoutData.reps}
                onChange={(e) =>
                  setUpdatedWorkoutData({
                    ...updatedWorkoutData,
                    reps: e.target.value,
                  })
                }
              />
            </>
          )}
          <button className="update-btn" type="submit">Update Workout</button>
        </form>
        //
      ) : (
        <>
          {type === "cardio" && (
            <div className='cardio-div'>
              <div className='d-flex justify-content-center'><img alt="cardio" src={cardioIcon} className="exercise-form-icon" /></div>
              <p><span>Date: </span> {cardioData.date}</p>
              <p><span>Name: </span> {cardioData.name}</p>
              <p><span>Distance: </span> {cardioData.distance} miles</p>
              <p><span>Duration: </span> {cardioData.duration} minutes</p>
              <button className='delete-btn' onClick={() => handleDeleteWorkout(id)}>Delete Exercise</button>
              <button className='update-btn' onClick={toggleUpdateForm}>Update Workout</button>
            </div>
          )}
          {type === "resistance" && (
            <div className='resistance-div'>
              <div className='d-flex justify-content-center'><img alt="resistance" src={resistanceIcon} className="exercise-form-icon" /></div>
              <p><span>Date: </span> {resistanceData.date}</p>
              <p><span>Name: </span> {resistanceData.name}</p>
              <p><span>Weight: </span> {resistanceData.weight} lbs</p>
              <p><span>Sets: </span> {resistanceData.sets}</p>
              <p><span>Reps: </span> {resistanceData.reps}</p>
              <button className='update-btn' onClick={toggleUpdateForm}>Update Workout</button>
              <button className='delete-btn' onClick={() => handleDeleteWorkout(id)}>Delete Workout</button>
            </div>
          )}
        </>
      )}
    </div>
  </div>
);
};
