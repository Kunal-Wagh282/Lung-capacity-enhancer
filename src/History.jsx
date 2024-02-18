import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useLocation, useNavigate ,Link} from 'react-router-dom';
import './ProfilePage.css'; 
import API_URL from './config'; // Import the API URL
import PopupMessage from './Components/PopupMessage';
import Sidebar from './Components/SideBar'; // Import your modal component
import DrawerComponent from './Components/Drawer'; 


function History() {
  
  const [newChildUsername, setNewChildUsername] = useState('');
  const [newChildDOB, setNewChildDOB] = useState('');
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState(false);
  const [errorMessage,setErrorMessage] = useState('');
  const [selectedProfileAge, setSelectedProfileAge] = useState(null);
  const [addingChildUser, setAddingChildUser] = useState(false);
  const userDataString = sessionStorage.getItem('userData');
  const userData = JSON.parse(userDataString);
  const [profiles, setProfiles] = useState(userData.profile);
  const [uid, setUid] = useState(userData.u_id);
  const [selectedProfileName, setSelectedProfileName] = useState(profiles.find(profile => profile.uid === profiles.uid).p_name);
// const uid = userData.u_id;
// const profiles = userData.profile;
// const username = userData.username;
// const password = userData.password;

// useEffect(() => {
//   sessionStorage.setItem('nowName', JSON.stringify(selectedProfileName));
// },[])
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
    
    const selectedProfile = profiles.find(profile => profile.p_name === e.target.value);
    setSelectedProfileAge(calculateAge(selectedProfile.p_dob));
    setSelectedProfileName(e.target.value);  

    sessionStorage.setItem('nowName', JSON.stringify(selectedProfileName));
    //console.log("Name",selectedProfileName)
    //console.log("UID", uid)
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
      if (response.status === 201) {
        setSelectedProfileName(newChildUsername);
        setSelectedProfileAge(calculateAge(newChildDOB)); 
        setProfiles(response.data["profile"]);
        setNewChildUsername('');
        setNewChildDOB('');
    
        setSuccessMessage(true);
        setErrorMessage('Username created successfully.');
        setTimeout(() => setSuccessMessage(false), 3000);
      }
      if (response.status === 204) {
        setSuccessMessage(true);
        setErrorMessage(`Invalid Age, please try again(age must be above 5)`)
        setTimeout(() => setSuccessMessage(false), 3000);
        setError(error)
        is400Error = true;
      }
      if (response.status === 226) {
        setSuccessMessage(true);
        setNewChildUsername('');
        setErrorMessage(`Username already exists, please try different username.`)
        setTimeout(() => setSuccessMessage(false), 3000);
        is400Error = true;
      }
      
    } catch (error) {  
        setSuccessMessage(true);
        setTimeout(() => setSuccessMessage(false), 3000);
    } finally {
      if (is400Error) {
        setAddingChildUser(false);
      } else {
        setAddingChildUser(false);
      }
    }
  };
  return (
    <>
    
    <div className="profile-page-container">
      <h2>Select User Name</h2>
      {profiles.length > 0 && (
        <div>
            <select className="dropdown-select" value={selectedProfileName} onChange={handleProfileChange}>
              {profiles.map((profile, index) => (
                <option className="dropdown-option" key={index} value={profile.p_name}>
                  {profile.p_name}   
                </option>
              ))}
            </select>
          <h2>Age:{(selectedProfileAge === null)? (setSelectedProfileAge(calculateAge(profiles.find(profile => profile.uid === profiles.uid).p_dob))):selectedProfileAge}</h2>
        </div>
      )}
      <DrawerComponent isOpen={addingChildUser} onClose={() => setAddingChildUser(false)} newChildUsername={newChildUsername} setNewChildUsername={setNewChildUsername} newChildDOB={newChildDOB} setNewChildDOB={setNewChildDOB} handleAddChildUser={handleAddChildUser}/>
      {successMessage && <PopupMessage message={errorMessage} />}
    </div>
    <Sidebar name={selectedProfileName}/>
    </>
  );
}
export default History;