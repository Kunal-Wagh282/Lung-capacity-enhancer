import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useLocation, useNavigate } from 'react-router-dom';
import './ProfilePage.css';
import API_URL from './config'; // Import the API URL
import PopupMessage from './PopupMessage';
import BleButton from './BleButton';
import Modal from './Modal'; // Import your modal component

function ProfilePage() {
  const { state } = useLocation();
  const [profiles, setProfiles] = useState(state?.profiles || []);
  const [uid, setUid] = useState(state?.uid);
  const [newChildUsername, setNewChildUsername] = useState('');
  const [newChildDOB, setNewChildDOB] = useState('');
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState(false);
  const [errorMessage,setErrorMessage] = useState('');
  const [selectedProfileAge, setSelectedProfileAge] = useState(null);
  const [selectedProfileName, setSelectedProfileName] = useState(profiles.find(profile => profile.uid === profiles.uid).p_name);
  const [listvalue, setListValue] = useState(profiles.find(profile => profile.uid === profiles.uid).p_name);
  const [addingChildUser, setAddingChildUser] = useState(false);

  const calculateAge = (dob) => {
    const dobDate = new Date(dob);
    const today = new Date();
    let age = today.getFullYear() - dobDate.getFullYear();
    const monthDiff = today.getMonth() - dobDate.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < dobDate.getDate())) {
      age--;
    }
    return age;
  };

  const handleProfileChange = (e) => { 
      
    setListValue(e.target.value);
    const selectedProfile = profiles.find(profile => profile.p_name === e.target.value);
    setSelectedProfileAge(calculateAge(selectedProfile.p_dob));
    setSelectedProfileName(e.target.value);   
  };

  
  const deleteChildUser = async () => {
    let is400Error = false;
    if (profiles.length === 1) {
      setSuccessMessage(true);
      setErrorMessage(`Main user can't be deleted`)
      setTimeout(() => setSuccessMessage(false), 3000);
      return;
    } else {
      setError('');
      try {
        const response = await axios.post(`${API_URL}/del-profile/`, {
          u_id: uid,
          p_name: selectedProfileName
        });
        if (response.status === 202) {
          setProfiles(response.data["profile"]);
          setSuccessMessage(true);
          setErrorMessage('Username deleted successfully.')
          setTimeout(() => setSuccessMessage(false), 3000);
        }
        if (response.status === 226) {
          setSuccessMessage(true);
          setErrorMessage(`Main user can't be deleted`)
          setTimeout(() => setSuccessMessage(false), 3000);
          let is400Error=true;
        }
      } catch (error) {
        setError(error)
      } 
    }
  };
  
  const handleAddChildUser = async () => {
    setError('');
    setAddingChildUser(true);
    let is400Error = false;
    try {
      const response = await axios.post(`${API_URL}/add-profile/`, {
        u_id: uid,
        p_name: newChildUsername,
        p_dob: newChildDOB,
      });
      console.log(response)
      if (response.status === 201) {
        setListValue(newChildUsername);
        setSelectedProfileAge(calculateAge(newChildDOB)); 
        setProfiles(response.data["profile"]);
        setNewChildUsername('');
        setNewChildDOB('');
        setSuccessMessage(true);
        setErrorMessage('Username created successfully.');
        setTimeout(() => setSuccessMessage(false), 3000);
      }
      if (response.status === 226) {
        setSuccessMessage(true);
        setErrorMessage(`Invalid Age, please try again(age is below 5)`)
        setTimeout(() => setSuccessMessage(false), 3000);
        setError(error)
        is400Error = true;
      }
    } catch (error) {  
        console.error( error);
        setSuccessMessage(true);
        setTimeout(() => setSuccessMessage(false), 3000);
    } finally {
      if (is400Error) {
        setAddingChildUser(true);
      } else {
        setAddingChildUser(false);
      }
    }
  };
  
  return (
    <div className="profile-page-container">
      <h2>Dashboard</h2>
      {profiles.length > 0 && (
        <div>
          <select className="dropdown-select" value={listvalue} onChange={handleProfileChange}>
            {profiles.map((profile, index) => (
              <option className="dropdown-option" key={index} value={profile.p_name}>
                {profile.p_name}   
              </option>
            ))}
          </select>
          <h2>Age:{(selectedProfileAge === null)? (setSelectedProfileAge(calculateAge(profiles.find(profile => profile.uid === profiles.uid).p_dob))):selectedProfileAge}</h2>
          <button onClick={() => setAddingChildUser(true)}>Add Child User</button>
          <button onClick={() => deleteChildUser(true)}>Delete Child User</button>
        </div>
      )}
     <Modal isOpen={addingChildUser} onClose={() => setAddingChildUser(false)} newChildUsername={newChildUsername} setNewChildUsername={setNewChildUsername} newChildDOB={newChildDOB} setNewChildDOB={setNewChildDOB} handleAddChildUser={handleAddChildUser} />

      {successMessage && <PopupMessage message={errorMessage} />}
      <BleButton/>
    </div>
  );
}

export default ProfilePage;
