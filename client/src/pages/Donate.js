import React,{useState} from 'react';
import StripeCheckout from "react-stripe-checkout";

const checkoutpage={
   width:'100%',
  height:'100%',
   position:'absolute',
   display:'inline-block'
  } 
  
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
<div style={checkoutpage}>
<label>Enter amount to donate</label>
<input onChange={numberHandle} style={reginput} type="number" placeholder="Enter Number" value={number} />
    <StripeCheckout
    stripeKey= "pk_test_TYooMQauvdEDq54NiTphI7jx"
    token={makePayment}
    name="Donate"
    amount={number * 100}>

   <button  className='btn-large '>
      Donate {number} $
    </button>
    
  </StripeCheckout>
  </div>
  </>
  );
  };

  export default Donate;
  