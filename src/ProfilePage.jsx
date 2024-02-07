import { useLocation } from 'react-router-dom';

function ProfilePage() {
  const { state } = useLocation();
  const profiles = state?.profiles;

  return (
    <div>
      <h2>Dashboard</h2>
      {profiles && (
        <ul>
          {profiles.map(profile => (
            <li key={profile.p_dob}>
              Name: {profile.p_name}, DOB: {profile.p_dob}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}


export default ProfilePage;
