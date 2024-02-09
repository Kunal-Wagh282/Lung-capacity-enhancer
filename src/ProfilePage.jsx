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
  const [deleteMessage, setDeleteMessage] = useState(false);
  const [selectedProfileAge, setSelectedProfileAge] = useState(null); // State to store selected profile age
  const [selectedProfileName, setSelectedProfileName] = useState('');
  const [listvalue, setValue] = useState('');
  const navigate = useNavigate();



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
    setValue(e.target.value);
    const selectedProfile = profiles.find(profile => profile.p_name === e.target.value);
    if (selectedProfile) {
      setSelectedProfileAge(calculateAge(selectedProfile.p_dob));
      setSelectedProfileName(selectedProfile.p_name);
    } else {
      setSelectedProfileAge(calculateAge(profiles.find(profile => profile.uid === profiles.uid).p_dob)); // Reset age if no profile selected
      setSelectedProfileName(profiles.find(profile => profile.uid === profiles.uid).p_name);
    }
  };




  const deleteChildUser = async () => {
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
        setDeleteMessage(true);
        setTimeout(() => setDeleteMessage(false), 3000);
      }
    } catch (error) {
      setError(error.message);
    } finally {
      setDeletingChildUser(false);
    }
  };
  





  const handleAddChildUser = async () => {
    setError('');
    setAddingChildUser(true);

    try {
      const response = await axios.post(`${API_URL}/add-profile/`, {
        u_id: uid, // Assuming the first profile in the array is the parent profile
        p_name: newChildUsername,
        p_dob: newChildDOB,
      });
      
      if (response.status === 201) {
       
        
        setProfiles(response.data["profile"]);
        setNewChildUsername('');
        setNewChildDOB('');
        setSuccessMessage(true); // Set to true to display the success message
        setTimeout(() => setSuccessMessage(false), 3000);
      }
    } catch (error) {
      setError(error.message);
    } finally {
      setAddingChildUser(false);
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

      {/* Display age of selected profile */}
      {/* {selectedProfileAge !== '' && (
        <p>Age of selected profile: {selectedProfileAge}</p>
      )} */}

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
          {error && <p className="error-message">{error}</p>}
        </div>
      )}

      {/* Pop-up message for success */}
      {successMessage && <PopupMessage message={`Username created successfully.`} />}
      {deleteMessage && <PopupMessage message={`Username deleted successfully.`} />}

      {deletingChildUser &&  (
        <>
  
        </>
      )}



    </div>
   
  );
  
}

export default ProfilePage;
