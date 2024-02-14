import React, {useState, useEffect, useRef } from 'react';
import axios from 'axios';
import API_URL from '../config'; // Import the API URL
import PopupMessage from './PopupMessage';
import './BleButton.css';
import LineGraph from './LineGraph';

function BleButton({uid,name}) {
    const [isConnected, setIsConnected] = useState(false);
    const [device, setDevice] = useState(null);
    const [time, setTime] = useState([0.00]);
    const [volumePerSecond, setVolumePerSecond] = useState([0.00]);
    const [showSuccessPopup, setShowSuccessPopup] = useState(false); // State to control the visibility of success popup
    const [error, setError] = useState('');
    const [totalVolume, setTotalVolume] = useState(0);
    
    const connectToDevice = async () => {
        try {
          const device = await navigator.bluetooth.requestDevice({
            filters:[{name:'LCE'}],
            optionalServices: ['0000fffe-0000-1000-8000-00805f9b34fb']
          });
          setDevice(device);
    
          const server = await device.gatt.connect();
          (server);
    
          device.addEventListener('gattserverdisconnected', onDisconnected);
    
          if (device.gatt.connected) {
            setShowSuccessPopup(true);
            setError('Bluetooth Connected Successfully to:'+device.name);
            setTimeout(() => setShowSuccessPopup(false), 3000);
            setIsConnected(true)
            const service = await server.getPrimaryService('0000fffe-0000-1000-8000-00805f9b34fb');
    
            const characteristic = await service.getCharacteristic('0000fffc-0000-1000-8000-00805f9b34fb');
    
            await characteristic.startNotifications();
            characteristic.addEventListener('characteristicvaluechanged', handleCharacteristicValueChanged);
          } else {
            console.error('Device disconnected.');
            alert('Device disconnected')
          }
        } catch (error) {
          console.error('Error connecting to device:', error);
          alert('Error Connecting to device...please try again!')
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
      console.log(" Original Time", time)
      useEffect(() => {
          if (time.length!==1 && time[time.length - 1] === 0 ) {
        time.pop();
        volumePerSecond.pop();
        while( time[time.length - 1]===time[time.length - 2]){
          time.pop();
          volumePerSecond.pop();
        }
        const sendData = async () => { // Define async function
          setError('');
          try {
    
            const response = await axios.post(`${API_URL}/graph-data/`, {
              u_id:uid,
              p_name:name,
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
          console.log("Time before resetting data:", time)
        setTime([0.00]);
        setVolumePerSecond([0.00]);
        console.log("Time after resetting data:", time)
        };
        sendData(); // Invoke the async function to execute
      }
      },[handleCharacteristicValueChanged]);


      console.log(" Original Time after hook", time)



    
      // console.log("Time",time)
      // console.log("Volume", volumePerSecond)
      const disconnectDevice = async () => {
        try {
          if (device && device.gatt.connected) {
            await device.gatt.disconnect();
            setDevice(null);
            setTime([0.00]);
            setVolumePerSecond([0.00]);
            setIsConnected(false);
          }
        } catch (error) {
          console.error('Error disconnecting from device:', error);
        }
      };
      const onDisconnected = (event) => {
        alert("Device Disconnected");
        setDevice(null);
        setTime([0.00]);
        setVolumePerSecond([0.00]);
        setIsConnected(false);
      };
    return (
        <>
            <button className="bluetooth-button" onClick={connectToDevice} disabled={isConnected}>
                Connect
            </button>
            <button className="bluetooth-button" onClick={disconnectDevice} disabled={!isConnected}>
                Disconnect
            </button>
            {device && <h3>Connected to: {device.name}</h3>}
            {!device && <h3>Disconnected</h3>}
      {showSuccessPopup && (<PopupMessage message={error}/>)}
      <div className='chart-canvas'>
      <LineGraph time={time} volumePerSecond={volumePerSecond}/>
      {<h2>Total Volume:{totalVolume}</h2>}
         </div>
        </>
    );
}

export default BleButton;
