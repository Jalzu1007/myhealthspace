import logo from './logo.svg';
import './App.css';
import AppNavbar from './components/Navbar';
import LoginForm from './components/LoginForm';
import SignupForm from './components/SignupForm';




function App() {
// this is where to set up the nav click fucntion and use state//

  return (
    <div className="App">
      {<AppNavbar/>}
      {<LoginForm/>}
      {<SignupForm/>}
    </div>
  );
}

export default App;
