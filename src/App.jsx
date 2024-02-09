// App.jsx
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import LoginForm from './LoginForm';
import ProfilePage from './ProfilePage';
import RegistrationForm from './RegistrationForm';
import Try from './Try';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" exact element={<RegistrationForm/>} />
        <Route path="/login" exact element={<LoginForm/>} />
        <Route path="/profiles" element={<ProfilePage/>} />
        <Route path="/try" element={<Try/>} />

      </Routes>
    </BrowserRouter>
  );
}

export default App;
