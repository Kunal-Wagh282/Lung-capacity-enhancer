import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useLocation, useNavigate } from 'react-router-dom';
import './ProfilePage.css';
import API_URL from './config'; // Import the API URL

function ProfilePage() {
  const { state } = useLocation();
  const [profiles, setProfiles] = useState(state?.profiles || []);
  const [uid, setUid] = useState(state?.uid);
  const [newChildUsername, setNewChildUsername] = useState('');
  const [newChildDOB, setNewChildDOB] = useState('');
  const [addingChildUser, setAddingChildUser] = useState(false);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    setProfiles(state?.profiles || []);
  }, [state?.profiles]);

  const handleAddChildUser = async () => {
    setError('');
    setAddingChildUser(true);

    try {
      const response = await axios.post(`${API_URL}/add-profile/`, {
        u_id: uid, // Assuming the first profile in the array is the parent profile
        p_name: newChildUsername,
        p_dob: newChildDOB,
      });
      console.log(response.data);
      if (response.status === 201) {
        const newProfile = { p_name: newChildUsername, p_dob: newChildDOB };
        setProfiles([...profiles, newProfile]);
        
        setNewChildUsername('');
        setNewChildDOB('');
        
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
          <select className="dropdown-select" value={uid} onChange={(e) => setUid(e.target.value)}>
            {profiles.map((profile, index) => (
              <option className="dropdown-option" key={index} value={profile.u_id}>
                {profile.p_name}
              </option>
            ))}
          </select>
          <button onClick={() => setAddingChildUser(true)}>Add Child User</button>
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
          {error && <p className="error-message">{error}</p>}
        </div>
      )}

      {/* Pop-up message for success */}
      {successMessage && <PopupMessage
          message={`Username created successfully.`}
        />}
    </div>
  );
}

export default ProfilePage;
