import React, {useState, useEffect, useRef } from 'react';
import axios from 'axios';
import Chart from 'chart.js/auto';
import API_URL from '../config'; // Import the API URL
import PopupMessage from './PopupMessage';
import './BleButton.css';

function BleButton({uid,name}) {
    const [isConnected, setIsConnected] = useState(false);
    const [successMessage, setSuccessMessage] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');
    const [device, setDevice] = useState(null);
    const [server, setServer] = useState(null);
    const [service, setService] = useState(null);
    const [characteristic, setCharacteristic] = useState(null);
    const [time, setTime] = useState([0.00]);
    const [volumePerSecond, setVolumePerSecond] = useState([0.00]);
    const chartRef = useRef(null);
    const chartInstance = useRef(null);
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
            setIsConnected(true)
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
              uid:uid,
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
            setIsConnected(false);
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
        setIsConnected(false);
      };
    
      useEffect(() => {
        if (chartRef.current) {
          if (chartInstance.current) {
            chartInstance.current.destroy();
          }  
          const ctx = chartRef.current.getContext('2d');
          chartInstance.current = new Chart(ctx, {
            type: 'line',
            data: {
              labels: time,
              datasets: [{
                label: 'Volume per second',
                data: volumePerSecond,
                borderColor: 'rgb(75, 192, 192)'
             
              }]
            },
            options: {
              scales: {
                x: {
                  beginAtZero: true,
                  type: 'linear',
                  position: 'bottom',
                  min: 0,
                  title: {
                    display: true,
                    text: 'Time',
                    tension:1
                  }
                },
                y: {
                  beginAtZero: true,
                  min: 0,
                  title: {
                    display: true,
                    text: 'Volume per second',
                    tension: 0.1
                  }
                }
              }
            }
          });
        }
      }, [time, volumePerSecond]); 




    return (
        <>
            <button className="bluetooth-button" onClick={connectToDevice} disabled={isConnected}>
                Connect
            </button>
            <button className="bluetooth-button" onClick={disconnectDevice} disabled={!isConnected}>
                Disconnect
            </button>
            {successMessage && <PopupMessage message={errorMessage}/>}
            {device && <h3>Connected to: {device.name}</h3>}
            {!device && <h3>Disconnected</h3>}
      {showSuccessPopup && (<PopupMessage message={error}/>)}
      <div className='chart-canvas'>
      <canvas ref={chartRef}  style={{ width: '200px', height: '200px' }}   />
      </div>
        </>
    );
}

export default BleButton;
