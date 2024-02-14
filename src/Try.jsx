import React, { useState, useEffect } from 'react';

import PopupMessage from './Components/PopupMessage'; // Import the PopupMessage component
import LineGraph from './Components/LineGraph';
import './Try.css';
import axios from 'axios';

function Try() {
  const [device, setDevice] = useState(null);
  const [server, setServer] = useState(null);
  const [service, setService] = useState(null);
  const [characteristic, setCharacteristic] = useState(null);
  const [time, setTime] = useState([0.00]);
  const [volumePerSecond, setVolumePerSecond] = useState([0.00]);
  
  
  const [showSuccessPopup, setShowSuccessPopup] = useState(false); // State to control the visibility of success popup
  const [error, setError] = useState('');


  const connectToDevice = async () => {
    try {
      const device = await navigator.bluetooth.requestDevice({
        filters:[{name:'LCE'}],
        optionalServices: ['0000fffe-0000-1000-8000-00805f9b34fb']
      });
      setDevice(device);

      const server = await device.gatt.connect();
      setServer(server);

      device.addEventListener('gattserverdisconnected', onDisconnected);

      if (device.gatt.connected) {
        const service = await server.getPrimaryService('0000fffe-0000-1000-8000-00805f9b34fb');
        setService(service);

        const characteristic = await service.getCharacteristic('0000fffc-0000-1000-8000-00805f9b34fb');
        setCharacteristic(characteristic);

        await characteristic.startNotifications();
        characteristic.addEventListener('characteristicvaluechanged', handleCharacteristicValueChanged);
      } else {
        console.error('Device disconnected.');
      }
    } catch (error) {
      console.error('Error connecting to device:', error);
    }
  };

  const handleCharacteristicValueChanged = (event) => {
    const value = event.target.value;
    const decoder = new TextDecoder('utf-8');
    const stringValue = decoder.decode(value);
    const [receivedTime, receivedVolume] = stringValue.split(',').map(parseFloat);
    setTime(prevTime => [...prevTime, receivedTime]);
    setVolumePerSecond(prevVolume => [...prevVolume, receivedVolume]);
    
  };
  
  if (time.length!=1 && time[time.length - 1] === 0) {
    const sendData = async () => { // Define async function
      setError('');
      try {
        const response = await axios.post(`${API_URL}/test/`, {
          time_array: time,
          volume_array: volumePerSecond
        });
        if (response.status === 201) {
          setShowSuccessPopup(true);
          setError('Data shared successfully!!');
          setTimeout(() => setShowSuccessPopup(false), 3000);
        }
        console.log(response); // Log response here
      } catch (error) {
        console.error('Error sending data:', error);
      }
    };
  
    //sendData(); // Invoke the async function to execute
    setTime([0.00]);
    setVolumePerSecond([0.00]);
  }
  console.log("Time",time)
  console.log("Volume", volumePerSecond)
  const disconnectDevice = async () => {
    try {
      if (device && device.gatt.connected) {
        await device.gatt.disconnect();
        setDevice(null);
        setServer(null);
        setService(null);
        setCharacteristic(null);
        // Send data to API and clear arrays
        setTime([0.00]);
        setVolumePerSecond([0.00]);
      }
    } catch (error) {
      console.error('Error disconnecting from device:', error);
    }
  };

  const onDisconnected = (event) => {
    alert("Device Disconnected");
    setDevice(null);
    setServer(null);
    setService(null);
    setCharacteristic(null);
    // Send data to API and clear arrays
    setTime([0.00]);
    setVolumePerSecond([0.00]);
  };

 
  return (
    <>
      <button className="bluetooth" onClick={connectToDevice}>CONNECT</button>
      <button className="bluetooth" onClick={disconnectDevice}>DISCONNECT</button>
      {device && <p>Connected to: {device.name}</p>}
      {showSuccessPopup && (<PopupMessage message={error}/>)}
      <div className='chart-canvas'>
      <LineGraph time={time} volumePerSecond={volumePerSecond}/>
      </div>
    </>
  );
}

export default Try;
