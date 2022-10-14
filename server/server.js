const express = require("express");
//import Apollo Server
const { ApolloServer } = require("apollo-server-express");

//import middleware
const { authMiddleware } = require("./utils/auth");

// import typeDefs and resolvers
const { typeDefs, resolvers } = require("./schema");
const db = require("./config/connection");

const PORT = process.env.PORT || 3001;
// create a new Apollo server and pass in the schema data
// provide the typeDefs and resolvers so they know what the API looks like
// and how to resolve requests
const server = new ApolloServer({
  typeDefs,
  resolvers,
  // every request performs an authenticationi check, and updated request object will be passed to the resolvers as the context
  context: authMiddleware, // used to set be used for the HTTP request headers and see only headers
});

const app = express();

app.use(express.urlencoded({ extended: false }));
app.use(express.json());

// Create a new instance of an Apollo server with the GraphQl schema
const startApolloServer = async (typeDefs, resolvers) => {
  await server.start();
  //integrate the Apollo server with the Expres application as middleware
  server.applyMiddleware({ app });

  db.once("open", () => {
    app.listen(PORT, () => {
      console.log(`API server running on port ${PORT}!`);
      //log where we can go to test the GQL API
      console.log(`Use GraphQL at http://localhost:${PORT}${server.graphqlPath}`);
    });
  });
};

// Call the async function to start the server
startApolloServer(typeDefs, resolvers);
