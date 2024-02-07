import { useLocation } from 'react-router-dom';
import './ProfilePage.css';



function ProfilePage() {
  const { state } = useLocation();
  const profiles = state?.profiles;

  return (
    <div className="dropdown-container">
  <h2>Dashboard</h2>
  {profiles && (
    <select className="dropdown-select" defaultValue={profiles[0].p_dob}>
      {profiles.map((profile, index) => (
        <option className="dropdown-option" key={index} value={profile.p_dob}>
          {profile.p_name}
        </option>
      ))}
    </select>
  )}
</div>

  
  );
}


export default ProfilePage;
