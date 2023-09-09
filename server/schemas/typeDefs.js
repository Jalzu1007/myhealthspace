const { gql } = require('apollo-server-express');

const typeDefs = gql`

  type User {
    _id: ID!
    username: String!
    email: String
    cardio: [Cardio]
    resistance: [Resistance]
  }

  type Resistance {
    _id: ID!
    name: String!
    type: String!
    weight: Float!
    sets: Int!
    reps: Int!
    date: Date!
    userId: ID!
  }

  type Cardio {
    _id: ID!
    type: String!
    name: String!
    distance: Float!
    duration: Float!
    date: Date!
    userId: ID!
  }

  type Auth {
    token: String!
    user: User!
  }
  
  type Query {
  getCardioById(cardioId: ID!): Cardio
  getResistanceById(resistanceId: ID!): Resistance
  getUser: User
}

  type Mutation {
  createCardio(cardioInput: CardioInput!): Cardio
  deleteCardio(cardioId: ID!): Cardio
  updateCardio(cardioId: ID!, cardioInput: CardioInput!): Cardio
  createResistance(resistanceInput: ResistanceInput!): Resistance
  deleteResistance(resistanceId: ID!): Resistance
  updateResistance(resistanceId: ID!, resistanceInput: ResistanceInput!): Resistance
  login(email: String!, password: String!): Auth
  addUser(username: String!, email: String!, password: String!): Auth
}
`;

module.exports = typeDefs;
