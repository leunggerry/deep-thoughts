/**
 * @description
 *  Resolvers: Functions we connect ot each query or mutation type definition that
 *          perform the CRUD actions that each query or mutation is expected to perform
 */

/**
 * import required
 */
const { User, Thought } = require("../models");
const { AuthenticationError } = require("apollo-server-express");
//import signToked
const { signToken } = require("../utils/auth");

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

    //query for the user's logged-in content
    me: async (parent, args, context) => {
      // check if user property exists in context
      if (context.user) {
        const userData = await User.findOne({ _id: context.user._id })
          .select("-__v -password")
          .populate("thoughts")
          .populate("friends");

        return userData;
      }

      throw new AuthenticationError("Not logged in");
    },
  },
  //mutations
  Mutation: {
    addUser: async (parent, args) => {
      // The mongoose User creates new user in the DB and use the args as params
      const user = await User.create(args);
      //create a token for the user
      const token = signToken(user);

      //return Auth type
      return { token, user };
    },
    login: async (parent, { email, password }) => {
      const user = await User.findOne({ email });

      if (!user) {
        throw new AuthenticationError("Incorrect credentials");
      }

      const correctPw = await user.isCorrectPassword(password);

      if (!correctPw) {
        throw new AuthenticationError("Incorrect credentials");
      }

      const token = signToken(user);
      // return Auth type with token and User type
      // token sent to he user can be used for other actions and requests.
      // the backend will then decode the token and know who was making the request
      return { token, user };
    },

    // mution for addThrought
    addThought: async (parent, args, context) => {
      //check if logged by existence of user in the context
      if (context.user) {
        const thought = await Thought.create({ ...args, username: context.user.username });

        await User.findByIdAndUpdate(
          { _id: context.user._id },
          { $push: { thoughts: thought._id } },
          { new: true }
        );

        return thought;
      }

      throw new AuthenticationError("You need to be logged in!");
    },

    // addreaction
    addReaction: async (parent, { thoughtId, reactionBody }, context) => {
      //check user if logged in
      if (context.user) {
        const updatedThought = await Thought.findOneAndUpdate(
          { _id: thoughtId },
          { $push: { reactions: { reactionBody, username: context.user.username } } },
          { new: true, runValidators: true }
        );

        return updatedThought;
      }

      throw new AuthenticationError("You need to be logged in!");
    },

    //add a new friend
    addFriend: async (parent, { friendId }, context) => {
      if (context.user) {
        const updateUser = await User.findOneAndUpdate(
          { _id: context.user._id },
          { $addToSet: { friends: friendId } },
          { new: true }
        ).populate("friends");

        return updateUser;
      }

      throw new AuthenticationError("You need to be logged in!");
    },
  },
};

module.exports = resolvers;
