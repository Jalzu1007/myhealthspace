const { gql } = require('apollo-server-express');

const typeDefs = gql`

  type User {
    _id: ID!
    username: String!
    email: String
    savedWorkouts: [Workout]
  }

  union Workout = Cardio | Resistance

  type Resistance {
    _id: ID!
    name: String!
    weight: Float!
    sets: Int!
    reps: Int!
    date: String!
    userId: ID!
  }

  type Cardio {
    _id: ID!
    name: String!
    distance: Float!
    duration: Float!
    date: String!
    userId: ID!
  }

  input CardioInput {
    name: String!
    distance: Float!
    duration: Float!
    date: String!
  }
  
  input ResistanceInput {
    name: String!
    weight: Float!
    sets: Int!
    reps: Int!
    date: String!
    userId: String!
  }

  type Auth {
    token: String!
    user: User!
  }
  
  type Query {
    user: User
    cardio(_id: ID!): Cardio
    resistance(_id: ID!): Resistance
    userWorkouts(userId: ID!): [Workout]
  }

  type Mutation {
  createCardio(cardioInput: CardioInput!): Cardio
  updateCardio(_id: ID!, cardioInput: CardioInput!): Cardio
  deleteCardio(_id: ID!): Cardio
  createResistance(resistanceInput: ResistanceInput!): Resistance
  updateResistance(_id: ID!, resistanceInput: ResistanceInput!): Resistance
  deleteResistance(_id: ID!): Resistance
  login(email: String!, password: String!): Auth
  createUser(username: String!, email: String!, password: String!): Auth
  saveCardioWorkout(userId: ID!, cardioId: ID!): User
  saveResistanceWorkout(userId: ID!, resistanceId: ID!): User
}
`;

module.exports = typeDefs;
