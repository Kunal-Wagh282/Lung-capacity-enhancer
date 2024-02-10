import React, { useState } from 'react';
import axios from 'axios';
import API_URL from './config'; // Import the API URL
import PopupMessage from './PopupMessage';
import './BleButton.css';

function BleButton() {
    const [isConnected, setIsConnected] = useState(false);
    const [successMessage, setSuccessMessage] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');

    const connectBle = async () => { 
        try {
            const response = await axios.post(`${API_URL}/bt-connect/`);
            console.log(response);
            if (response.status === 200) {
                setIsConnected(true);
                setSuccessMessage(true);
                setErrorMessage('Bluetooth connected successfully.');
                setTimeout(() => setSuccessMessage(false), 3000); // Display the message for 3 seconds before hiding it.
            }
        } 
        catch (error) {  
            console.error(error);
            setSuccessMessage(true);
            setErrorMessage('Error connecting to Bluetooth.');
            setTimeout(() => setSuccessMessage(false), 5000); // Display the message for 3 seconds before hiding it.
        }
    }

    const disconnectBle = async () => { 
        try {
            const response = await axios.post(`${API_URL}/bt-disconnect/`);
            console.log(response);
            if (response.status === 200) {
                setIsConnected(false);
                setSuccessMessage(true);
            }
        } 
        catch (error) {  
            console.error(error);
            setSuccessMessage(true);
        }
    }

    return (
        <>
            <button className="bluetooth-button" onClick={connectBle} disabled={isConnected}>
                Connect
            </button>
            <button className="bluetooth-button" onClick={disconnectBle} disabled={!isConnected}>
                Disconnect
            </button>
            {successMessage && <PopupMessage message={errorMessage}/>}
        </>
    );
}

export default BleButton;
