import React from 'react';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import logo from './logo.svg';
import './App.css';
import AppNavbar from './components/Navbar';
import LoginForm from './components/LoginForm';
import SignupForm from './components/SignupForm';
import Homepage from './components/Homepage';
import {
  ApolloClient,
  InMemoryCache,
  ApolloProvider,
  createHttpLink,
} from "@apollo/client";
import { setContext } from "@apollo/client/link/context";

const httpLink = createHttpLink({
  uri: "/graphql",
});

const authLink = setContext((_, { headers }) => {
  // get the authentication token from local storage if it exists
  const token = localStorage.getItem("id_token");
  // return the headers to the context so httpLink can read them
  return {
    headers: {
      ...headers,
      authorization: token ? `Bearer ${token}` : "",
    },
  };
});
const client = new ApolloClient({
  link: authLink.concat(httpLink),
  cache: new InMemoryCache(),
});




function App() {
  const [activeSection, setActiveSection] = useState('homepage'); 

  const handleNavClick = (section) => {
    setActiveSection(section);
  };

  return (
    <ApolloProvider client={client}>
      <Router>
        <AppNavbar onNavClick={handleNavClick} />
        <Switch>
          <Route exact path="/" component={Homepage} />
          <Route path="/login" component={LoginForm} />
          <Route path="/signup" component={SignupForm} />
        </Switch>
      </Router>
    </ApolloProvider>
  );
}

export default App;
