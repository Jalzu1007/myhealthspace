import { gql } from '@apollo/client';

export const QUERY_USER = gql`
  query GetUser {
  getUser {
    _id
    username
    email
    token
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

// export const QUERY_CHECKOUT = gql`
//   query getCheckout($amount: Int) {
//     checkout(amount: $amount) {
//       session
//     }
//   }
// `;