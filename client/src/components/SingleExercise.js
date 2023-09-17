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
import { DELETE_WORKOUT} from '../utils/mutations'; // Import the DELETE_EXERCISE mutation
import { UPDATE_WORKOUT } from '../utils/mutations';
import Cardio from '../components/Cardio';
import Resistance from '../components/Resistance';
import { QUERY_USER } from '../utils/queries';

export default function SingleExercise() {
    const { id, type } = useParams();
    const [cardioData, setCardioData] = useState({})
    const [resistanceData, setResistanceData] = useState({})
    const { loading, error, data } =useQuery(QUERY_USER);

    const loggedIn = Auth.loggedIn();
    const navigate = useNavigate()

      // Define the DELETE_EXERCISE mutation
    const [deleteWorkout] = useMutation(DELETE_WORKOUT);
    const [updateWorkout] = useMutation(UPDATE_WORKOUT);

    useEffect(() => {
      if (data && data.getUser) {
        const savedCardioWorkout = data.getUser.savedWorkouts.find(
          (workout) => workout._id === id && workout.type === 'cardio'
        );
  
        if (savedCardioWorkout) {
          const cardio = {
            _id: savedCardioWorkout._id,
            type: savedCardioWorkout.type,
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
            type: savedResistanceWorkout.type,
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



    // useEffect(() => {
    //      const displayExercise = async (_id) => {
    //         //get token
    //          const token =  Auth.getToken();

    //          if (!token) return false;

    //         // fetch cardio data by id
    //         if (type === "cardio") {
    //             try {
    //                  const response = await deleteWorkout(_id, token);
    //                 if (!response.ok) { throw new Error('something went wrong!') }

    //                 const cardio = await response.json()
    //                 cardio.date = formatDate(cardio.date)
    //                 setCardioData(cardio)
    //              } catch (err) { console.error(err) }
    //         }

    //         // fetch resistance data by id
    //         else if (type === "resistance") {
    //              try {
    //                 const response = await deleteWorkout(_id, token);
    //                  if (!response.ok) { throw new Error('something went wrong!') }

    //                  const resistance = await response.json()
    //                 resistance.date = formatDate(resistance.date)
    //                 setResistanceData(resistance)
    //             } catch (err) { console.error(err) }
    //         }
    //      }

    //     displayExercise(id)
    // }, [id, type, loggedIn])

    //  if (!loggedIn) {
    //     return <Navigate to="/login" />;
    //  }

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

const handleUpdateWorkout = async (id, updatedData) => {
  try {
    const { data } = await updateWorkout({
      variables: { id, input: updatedData },
    });

    // Check the response to see if the workout was successfully updated
    if (data.updateWorkout) {
      // Handle success, e.g., update the UI or display a success message
      console.log('Workout updated successfully');
      // You may want to refresh the data after updating.
      // You can call the displayExercise function or refetch your data here.
    } else {
      // Handle failure, e.g., show an error message
      console.error('Failed to update workout');
    }
  } catch (error) {
    // Handle any errors that occur during the mutation
    console.error('Error updating workout', error);
  }
};

     return (
        <div className={type === "cardio" ? "single-cardio" : "single-resistance"}>
            <Header />
            <h2 className='title text-center'>History</h2>
             <div className="single-exercise d-flex flex-column align-items-center text-center">
                 {type === "cardio" && (<div className='cardio-div '>
                     <div className='d-flex justify-content-center'><img alt="cardio" src={cardioIcon} className="exercise-form-icon" /></div>
                    
                     <p><span>Date: </span> {cardioData.date}</p>
                    <p><span>Name: </span> {cardioData.name}</p>
                     <p><span>Distance: </span> {cardioData.distance} miles</p>
                    <p><span>Duration: </span> {cardioData.duration} minutes</p>
                    <button className='delete-btn' onClick={() => handleDeleteWorkout(id)}>Delete Exercise</button>
                    <button className='update-btn' onClick={() => handleUpdateWorkout(id, updateWorkout)}>Update Workout</button>

                </div>)}
                 {type === "resistance" && (<div className='resistance-div'>
                     <div className='d-flex justify-content-center'><img alt="resistance" src={resistanceIcon} className="exercise-form-icon" /></div>
                    <p><span>Date: </span> {resistanceData.date}</p>
                    <p><span>Name: </span> {resistanceData.name}</p>
                     <p><span>Weight: </span> {resistanceData.weight} lbs</p>
                     <p><span>Sets: </span> {resistanceData.sets}</p>
                     <p><span>Reps: </span> {resistanceData.reps}</p>
                     <button className='delete-btn' onClick={() => handleDeleteWorkout(id)}>Delete Workout</button>
                     <button className='update-btn' onClick={() => handleUpdateWorkout(id, updateWorkout)}>Update Workout</button>

                 </div>)}
             </div>
         </div>

     )
 }
