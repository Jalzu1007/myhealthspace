import React,{useState} from 'react';
import StripeCheckout from "react-stripe-checkout";
import Header from "../components/Header"

// const checkoutpage={
//    width:'100%',
//   height:'100%',
//    position:'absolute',
//    display:'inline-block'
//   } 
  
 function Donate() {
    
      var [number, setNumber] = useState('')
      const [donationCompleted, setDonationCompleted] = useState(false);

      const reginput = {
        
        border: "2px solid purple",
        borderRadius: "2px",
        textAlign:"center",
        display: "block",
        fontFamily: "inherit",
        fontSize: "14px",
        padding: "10px" ,
        width: "100%",
        height:"30px",
        marginLeft: "0px",
        marginTop:"12px",
         
      }
      const numberHandle = (event) => {
        setNumber(event.target.value);
      }; 
      const makePayment = token => {
        const body = {
          token,
          number
        };
        const headers = {
          "Content-Type": "application/json"
        };
    
        return fetch(`http://localhost:8282/donate`, {
          method: "POST",
          headers,
          body: JSON.stringify(body)
        })
          .then(response => {
            console.log("RESPONSE ", response);
            const { status } = response;
            console.log("STATUS ", status);
            if (status === 200) {
          setDonationCompleted(true);
            }
          })
          .catch(error => console.log(error));
      };
  return(
      
    

<>
<Header />
<h2 className='title text-center'>Donate</h2>
<div className="donate-container">
  <div className="donate-form d-flex flex-column align-items-center justify-content-center">
    <label>Enter amount to donate</label>
    <div className="input-group mb-3 mt-3">
      <span className="input-group-text">$</span>
      <input
        type="text"
        className="form-control"
        aria-label="Amount (to the nearest dollar)"
        onChange={numberHandle}
        value={number}
        placeholder="Enter Number"
      />
    </div>
    <StripeCheckout
      stripeKey="pk_test_TYooMQauvdEDq54NiTphI7jx"
      token={makePayment}
      name="Donate"
      amount={number * 100}
    >
      <button className='donate-btn btn-large'>
        Donate
      </button>
    </StripeCheckout>
  </div>
</div>
  </>
  );
  };

  export default Donate;
  