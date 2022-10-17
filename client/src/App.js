import React from "react";
/**
 * ApolloProvider is a special type of React component that we'll use to provide data to all of the other components.
 *
 * ApolloClient is a constructor function that will help initialize the connection to the GraphQL API server.
 *
 * InMemoryCache enables the Apollo Client instance to cache API response data so that we can perform requests more efficiently.
 *
 * createHttpLink allows us to control how the Apollo Client makes a request. Think of it like middleware for the outbound network requests.
 */
import { ApolloProvider, ApolloClient, InMemoryCache, createHttpLink } from "@apollo/client";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import Header from "./components/Header";
import Footer from "./components/Footer";

//import components
import Home from "./pages/Home";
import Login from "./pages/Login";
import NoMatch from "./pages/NoMatch";
import SingleThought from "./pages/SingleThought";
import Profile from "./pages/Profile";
import Signup from "./pages/Signup";

// establish new link to graphQL server
const httpLink = createHttpLink({
  uri: "/graphql",
});

// ApolloClient constructor to instantiate the Apollo Client instant that create
// connection to API endpoints
// Instanitate InMemoryCache
const client = new ApolloClient({
  link: httpLink,
  cache: new InMemoryCache(),
});

function App() {
  return (
    // pass the client variable as the value for ht eclient prop
    <ApolloProvider client={client}>
      {/* Router component makes all child components on the page aware of the client-side routing */}
      <Router>
        <div className="flex-column justify-flex-start min-100-vh">
          <Header />
          <div className="container">
            {/* Routes hold several Route components that signify this part of th app
                where the content  will change according to the url route */}
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/login" element={<Login />} />
              <Route path="/signup" element={<Signup />} />
              <Route path="/profile">
                <Route path=":username" element={<Profile />} />
                <Route path="" element={<Profile />} />
              </Route>
              <Route path="/thought/:id" element={<SingleThought />} />
              <Route path="*" element={<NoMatch />} />
            </Routes>
          </div>
          <Footer />
        </div>
      </Router>
    </ApolloProvider>
  );
}

export default App;
