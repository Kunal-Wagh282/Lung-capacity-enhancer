import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useLocation, useNavigate } from 'react-router-dom';
import './ProfilePage.css';
import API_URL from './config'; // Import the API URL
import PopupMessage from './PopupMessage';

function ProfilePage() {
  const { state } = useLocation();
  const [profiles, setProfiles] = useState(state?.profiles || []);
  const [uid, setUid] = useState(state?.uid);
  const [newChildUsername, setNewChildUsername] = useState('');
  const [newChildDOB, setNewChildDOB] = useState('');
  const [addingChildUser, setAddingChildUser] = useState(false);
  const [deletingChildUser, setDeletingChildUser] = useState(false);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState(false);
  const [errorMessage,setErrorMessage] = useState('');
  const [selectedProfileAge, setSelectedProfileAge] = useState(null); // State to store selected profile age
  const [selectedProfileName, setSelectedProfileName] = useState(profiles.find(profile => profile.uid === profiles.uid).p_name);
  const [listvalue, setListValue] = useState(profiles.find(profile => profile.uid === profiles.uid).p_name);
  const navigate = useNavigate();
  let mainUser=profiles.find(profile => profile.uid === profiles.uid).p_name;
  // console.log('SelectedProfile', selectedProfileName)
  // console.log('MainUser',mainUser)

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
    console.log('SelectedProfile',selectedProfile)
    setSelectedProfileAge(calculateAge(selectedProfile.p_dob));
    setSelectedProfileName(e.target.value);   
    //}
    //console.log(profiles.find(profile => profile.u_id === profiles.uid).p_name); 
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
      setDeletingChildUser(true);
      try {
        const response = await axios.post(`${API_URL}/del-profile/`, {
          u_id: uid,
          p_name: selectedProfileName
        });
        if (response.status === 202) {
          // Remove the deleted profile from the profiles array
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
      } finally {
        if (is400Error) {
          setDeletingChildUser(true); // Set to true if 400 error occurred
        } else {
          setDeletingChildUser(false);
        }
      }
    }
  };
  
  
  
  const handleAddChildUser = async () => {
    setError('');
    setAddingChildUser(true);
  
    let is400Error = false; // Flag to indicate if a 400 error occurred
    
    try {
      const response = await axios.post(`${API_URL}/add-profile/`, {
        u_id: uid, // Assuming the first profile in the array is the parent profile
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
        setSuccessMessage(true); // Set to true to display the success message
        setErrorMessage('Username created successfully.'); // Set
        setTimeout(() => setSuccessMessage(false), 3000);
      }
      if (response.status === 226) {
        setSuccessMessage(true);
        setErrorMessage(`Invalid Age, please try again(age is below 5)`)
        setTimeout(() => setSuccessMessage(false), 3000);
        setError(error) // Store the error response data for further use
        is400Error = true; // Set flag to true if 400 error occurred
      }
    } catch (error) {  
        console.error( error);
        setSuccessMessage(true);
        //setErrorMessage('An unexpected error occurred. Please try again later.');
        setTimeout(() => setSuccessMessage(false), 3000);
    } finally {
    
      if (is400Error) {
        setAddingChildUser(true); // Set to true if 400 error occurred
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

      {/* Form to add a child user */}
      {addingChildUser && (
        <div className="add-child-user-form">
          <h3>Add Child User</h3>
          <input
            type="text"
            value={newChildUsername}
            onChange={(e) => setNewChildUsername(e.target.value)}
            placeholder="Child Username"
            required
          />
          <input
            type="date"
            value={newChildDOB}
            onChange={(e) => setNewChildDOB(e.target.value)}
            placeholder="Child Date of Birth"
            required
          />
          <button onClick={handleAddChildUser} disabled={!addingChildUser}>
            Add
          </button>
          
        </div>
      )}

      {/* Pop-up message for success */}
      {successMessage && <PopupMessage message={errorMessage} />}
      
    </div>
   
  );
  
}

export default ProfilePage;
