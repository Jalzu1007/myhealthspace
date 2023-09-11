import { gql } from '@apollo/client';

  export const QUERY_USER = gql`
    query user {
      user {
        _id
        username
        email
        savedWorkouts {
          _id
          name
        }
      }
    }
  `;

  export const QUERY_CARDIO = gql`
    query cardio($_id: ID!) {
      cardio(_id: $_id) {
        _id
        type
        name
        distance
        duration
        date
        userId
      }
    }
  `;

  export const QUERY_RESISTANCE = gql`
    query resistance($_id: ID!) {
      resistance(_id: $_id) {
        _id
        type
        name
        weight
        sets
        reps
        date
        userId
      }
    }
  `;

  export const QUERY_USER_WORKOUTS = gql`
    query workouts($userId: ID!) {
      workouts(userId: $userId) {
        _id
        name
        type
      }
    }
  `;
