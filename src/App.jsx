// App.jsx
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import LoginForm from './LoginForm';
import ProfilePage from './ProfilePage';
import RegistrationForm from './RegistrationForm';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" exact element={<RegistrationForm/>} />
        <Route path="/login" exact element={<LoginForm/>} />
        <Route path="/profiles" element={<ProfilePage/>} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
