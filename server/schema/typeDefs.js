/**
 * @description
 * Type Definitions:  or TypeDefs for short, involves literally defining
 *              every piece of datat that the client can expect to work with through
 *              a query or mution. Every GraphQL API starts with defining this data,
 *              as this type of strict type definition will give tht lcient more
 *              clarity as to what they are asking for and what they can expect in
 *              return. Think of this as defining the API endpoint, but also defining
 *              the exact data and parameters that are tied to that endpoint
 *
 */

/**
 * imports
 */
//import gql tagged template function from Apollo
// tagged template functions are advanced use of template literals from ES6
const { gql } = require("apollo-server-express");

//create typeDefs
// Defining a Query is type Query{}
// Always specify the type of datat that is returned
/**
 * @return
 * @param thoughts - list of Thought model
 *                  in the thought model instruct the query to return more data types (id, thoughtText, username, reactionCount)
 */
const typeDefs = gql`
  type User {
    _id: ID
    username: String
    email: String
    friendCount: Int
    thoughts: [Thought]
    friends: [User]
  }

  type Thought {
    _id: ID
    thoughtText: String
    createdAt: String
    username: String
    reactionCount: Int
    reactions: [Reaction]
  }

  type Reaction {
    _id: ID
    reactionBody: String
    createdAt: String
    username: String
  }

  type Query {
    users: [User]
    user(username: String!): User
    thoughts(username: String): [Thought]
    thought(_id: ID!): Thought
  }
`;

//export the typeDefs
module.exports = typeDefs;
