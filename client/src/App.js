import logo from './logo.svg';
import './App.css';
import AppNavbar from './components/Navbar';
import LoginForm from './components/LoginForm';
import SignupForm from './components/SignupForm';




function App() {
  return (
    <div className="App">
      {<AppNavbar/>}
      {<LoginForm/>}
      {<SignupForm/>}
    </div>
  );
}

export default App;
