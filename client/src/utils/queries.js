import { gql } from '@apollo/client';

export const QUERY_USER = gql`
  query getUser($userId: ID!) {
    getUser(_id: $userId) {
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
`;

export const QUERY_WORKOUTS = gql`
  query listWorkouts {
    listWorkouts {
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
`;
