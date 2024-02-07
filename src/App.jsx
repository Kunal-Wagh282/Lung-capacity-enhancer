// App.jsx
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import LoginForm from './LoginForm';
import ProfilePage from './ProfilePage';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" exact element={<LoginForm/>} />
        <Route path="/profiles" element={<ProfilePage/>} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
