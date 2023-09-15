import { gql } from '@apollo/client';

export const LOGIN_USER = gql`
  mutation login($email: String!, $password: String!) {
    login(email: $email, password: $password) {
      token
      user {
        _id
        username
        email
        savedWorkouts {
          _id
          type
          name
          distance
          duration
          weight
          sets
          reps
          date
        }
      }
    }
  }
`;

export const CREATE_USER = gql`
  mutation createUser($username: String!, $email: String!, $password: String!) {
    createUser(username: $username, email: $email, password: $password) {
      token
      _id
      username
    }
  }
`;

export const CREATE_WORKOUT = gql`
  mutation CreateWorkout($input: WorkoutInput!) {
    createWorkout(input: $input) {
      _id
      type
      name
      distance
      duration
      weight
      sets
      reps
      date
      userId  
     }
  }
`;

export const UPDATE_WORKOUT = gql`
  mutation UpdateWorkout($id: ID!, $input: WorkoutInput!) {
    updateWorkout(id: $id, input: $input) {
      _id
      type
      name
      distance
      duration
      weight
      sets
      reps
      date
      userId  
    }
  }
`;

export const DELETE_WORKOUT = gql`
  mutation DeleteWorkout($id: ID!) {
    deleteWorkout(id: $id)
  }
`;