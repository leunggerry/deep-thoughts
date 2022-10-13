/**
 * @description
 *  Resolvers: Functions we connect ot each query or mutation type definition that
 *          perform the CRUD actions that each query or mutation is expected to perform
 */

/**
 * import required
 */
const { User, Thought } = require("../models");

// Resolvers are like controllers
// Controller file wrks in that it servers of performing an action
const resolvers = {
  Query: {
    //when we query thoughts, use the find mehtod on the Thought model
    // return in descending order
    // resolvers can have up to 4 arguments
    // Parent - This is if we used nested resolvers to handle more
    //          complicated actions, as it would hold the reference
    //          to the resolver that executed the nested resolver
    //          function. We won't need this throughout the project,
    //          but we need to include it as the first argument.
    // args - This is an object of all of the values passed into a query or mutation
    //        request as parameters. In our case, we destructure the username parameter out to be used.
    // context - if we need same data to be accessible by all resolvers such as logged-in
    //           user's status or api
    // info - extra info about operations' current state
    thoughts: async (parent, { username }) => {
      const params = username ? { username } : {}; //if username is passed in if it is set
      return Thought.find(params).sort({ createdAt: -1 }); //return in descending order
    },

    // find a thought based on the _id
    thought: async (parent, { _id }) => {
      return Thought.findOne({ _id });
    },

    /**
     * @description User queries
     */
    // get all users
    // leave out the version code, password, include user's friends, and user's thoguhts
    users: async () => {
      return User.find().select("-__v -password").populate("friends").populate("thoughts");
    },

    //get one user
    user: async (parent, { username }) => {
      return User.findOne({ username })
        .select("-__v -password")
        .populate("friends")
        .populate("thoughts");
    },
  },
};

module.exports = resolvers;
