import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useLocation, useNavigate } from 'react-router-dom';
import API_URL from './config'; // Import the API URL
import PopupMessage from './PopupMessage';
import './BleButton.css';



export default function BleButton() {
    const [isConnected, setIsConnected] = useState(false);
    const [successMessage, setSuccessMessage] = useState(false);
    const [message,setMessage] = useState('');



    const connectBle= async() => { 
      
       console.log("connectBle");
       let isConnected = false; // Flag to indicate if a 400 error occurred
    try {
      //const response = await axios.post(`${API_URL}//`)
      //console.log(response)
    //   if (response.status === 201) {
    //     setIsConnected = true; // Setting
    //   }
    
        setSuccessMessage(true);
        setMessage('Bluetooth Connected');
        setTimeout(() => setSuccessMessage(false), 3000);
    } 
    catch (error) {  
        console.error( error);
        setSuccessMessage(true);
        setMessage('An unexpected error occurred. Please try again later.');
        setTimeout(() => setSuccessMessage(false), 3000);
    } 
         
      };
return(
<>
<button className="bluetooth-button" onClick={connectBle} >
  Connect
</button>
{successMessage && <PopupMessage message={message} />}
</>
)
}











