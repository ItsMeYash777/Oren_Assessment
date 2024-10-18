
import './App.css'
import SignIn from './components/SignIn'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import SignUp from './components/SignUp';
import DashBoard from "./components/DashBoard"
function App() {

  return (

      <Router>
        <Routes>
          <Route path="/" element={<SignIn />} />
          <Route path="/signup" element={<SignUp />} />
          <Route path="/dashboard" element={<DashBoard />} />
        </Routes>
      </Router>

  );
}

export default App
