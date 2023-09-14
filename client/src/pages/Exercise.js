import React from 'react'
import { Navigate, useNavigate } from 'react-router-dom';
import Auth from "../utils/auth";
import Header from "../components/Header";
import cardioImage from '../images/cardio.png';
import resistanceImage from '../images/resistance.png';





export default function Exercise() {
  const loggedIn = Auth.loggedIn();
  const navigate = useNavigate()


  // If the user is not logged in, redirect to the login page
  if (!loggedIn) {
    return <Navigate to="/login" />;
  }

  return (
    // <div className="exercise-page" style={{ backgroundImage: `url(${backgroundImage})` }}>
    <div>
      <Header />
      <div className="exercise-container">
        <h2 className='title'>Add Exercise</h2>
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
      </div>
    </div>
  );
}

//   return (
//     <div>
//       <Header />
//       <div className="exercise d-flex flex-column align-items-center">
//         <h2 className='title'>Add Exercise</h2>
//         <div>
//           <button className='cardio-btn d-flex flex-column  align-items-center justify-content-center' onClick={() => navigate("/exercise/cardio")}>
//             <img alt="cardio" src={cardioImage} className="exercise-icon" />
//             Cardio
//           </button>
//         </div>
//         <div>
//           <button className='resistance-btn d-flex flex-column  align-items-center justify-content-center' onClick={() => navigate("/exercise/resistance")}>
//             <img alt="resistance" src={resistanceImage} className="exercise-icon" />
//             Resistance
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// }