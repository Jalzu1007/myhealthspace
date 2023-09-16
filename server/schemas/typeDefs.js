const { gql } = require("apollo-server-express");

const typeDefs = gql`
  type User {
    _id: ID!
    username: String!
    email: String
    token: String
    savedWorkouts: [Workout]
  }
  type Workout {
    _id: ID!
    type: String!
    name: String!
    distance: Float
    duration: Float
    weight: Float
    sets: Int
    reps: Int
    date: String!
  }
  input WorkoutInput {
    type: String!
    name: String!
    distance: Float
    duration: Float
    weight: Float
    sets: Int
    reps: Int
    date: String!
    # userId: ID!
  }
  type Auth {
    token: String!
    user: User!
  }
  type Query {
    getUser: User
    listWorkouts: [Workout]
  }
  type Mutation {
    login(email: String!, password: String!): Auth
    createUser(username: String!, email: String!, password: String!): User
    createWorkout(input: WorkoutInput!): Workout
    updateWorkout(id: ID!, input: WorkoutInput!): Workout
    deleteWorkout(id: ID!): ID
  }
`;

module.exports = typeDefs;
