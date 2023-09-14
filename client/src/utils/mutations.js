import { gql } from '@apollo/client';

export const LOGIN_USER = gql`
  mutation login($email: String!, $password: String!) {
    login(email: $email, password: $password) {
      token
      user {
        _id
        username
        email
        savedWorkouts{
          ... on Cardio {
            _id
            name
            distance
            duration
            date
          }
          ... on Resistance {
            _id
            name
            weight
            sets
            reps
            date
          }
        }
      }
    }
  }
`;

export const CREATE_USER = gql`
  mutation createUser($username: String!, $email: String!, $password: String!) {
    createUser(username: $username, email: $email, password: $password) {
      token
      user {
        _id
        username
      }
    }
  }
`;

export const CREATE_CARDIO = gql`
  mutation createCardio($cardioInput: CardioInput!) {
    createCardio(cardioInput: $cardioInput) {
      _id
      name
      distance
      duration
      date
    }
  }
`;

export const UPDATE_CARDIO = gql`
  mutation updateCardio($_id: ID!, $cardioInput: CardioInput!) {
    updateCardio(_id: $_id, cardioInput: $cardioInput) {
      _id
      name
      distance
      duration
      date
    }
  }
`;

export const DELETE_CARDIO = gql`
  mutation deleteCardio($_id: ID!) {
    deleteCardio(_id: $_id)
  }
`;

export const CREATE_RESISTANCE = gql`
  mutation createResistance($resistanceInput: ResistanceInput!) {
    createResistance(resistanceInput: $resistanceInput) {
      _id
      name
      weight
      sets
      reps
      date
    }
  }
`;

export const UPDATE_RESISTANCE = gql`
  mutation updateResistance($_id: ID!, $resistanceInput: ResistanceInput!) {
    updateResistance(_id: $_id, resistanceInput: $resistanceInput) {
      _id
      name
      weight
      sets
      reps
      date
    }
  }
`;

export const DELETE_RESISTANCE = gql`
  mutation deleteResistance($_id: ID!) {
    deleteResistance(_id: $_id)
  }
`;
