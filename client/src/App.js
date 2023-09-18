import React from 'react';
import {
  ApolloClient,
  InMemoryCache,
  ApolloProvider,
  createHttpLink,
} from '@apollo/client';
import { setContext } from '@apollo/client/link/context';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Login from './pages/Login';
import Signup from './pages/Signup';
import SingleExercise from './components/SingleExercise';
import Profile from './pages/Profile';
import Exercise from './pages/Exercise';
import Error from './pages/Error';
import Cardio from './components/Cardio';
import Resistance from './components/Resistance';
import Donate from './pages/Donate'
import Confirmation from './pages/Confirmation'

// Construct our main GraphQL API endpoint
const httpLink = createHttpLink({
  uri: 'http://localhost:3001/graphql',
});

// Construct request middleware that will attach the JWT token to every request as an `authorization` header
const authLink = setContext((_, { headers }) => {
  // get the authentication token from local storage if it exists
  const token = localStorage.getItem('id_token');
  // return the headers to the context so httpLink can read them
  return {
    headers: {
      ...headers,
      authorization: token ? `Bearer ${token}` : '',
    },
  };
});

const client = new ApolloClient({
  // Set up our client to execute the `authLink` middleware prior to making the request to our GraphQL API
  link: authLink.concat(httpLink),
  cache: new InMemoryCache(),
});

function App() {
  return (
    <ApolloProvider client={client}>
      <Router>
        
        <div className="flex-column justify-flex-start min-100-vh">
           {/* Other components */}
          {/* { <Header /> } */}
          <div className="container">
            <Routes> 
            <Route path="/" element={<Home />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/login" element={<Login />} />
            <Route path="/profile" element={<Profile />} />
            { <Route path="/profile/:type/:id" element={<SingleExercise />} /> }
            <Route path="/exercise" element={<Exercise />} />
            <Route path="/exercise/cardio" element={<Cardio />} />
            <Route path="/exercise/resistance" element={<Resistance />} />
            <Route path="/donate" element={<Donate />} />
            <Route path='/confirmation' component={<Confirmation />}/>
            <Route path="*" element={<Error />} />
            </Routes>
          </div>
        </div>
      </Router>
    </ApolloProvider>
  );
}

export default App;

