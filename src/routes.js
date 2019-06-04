import React from "react";
import { Route, Router } from "react-router-dom";

import Home from "./components/Home/Home";
import Callback from "./components/Callback/Callback";
import auth from "./components/Auth/Auth";
import LandingPage from "./components/LandingPage/LandingPage";
import BlogPage from "./components/BlogPage/BlogPage";
import history from "./utils/history";

import { ApolloProvider } from "react-apollo";
import makeApolloClient from "./apollo";

import "tabler-react/dist/Tabler.css";

let client;

const provideClient = (Component, renderProps) => {
  // check if logged in
  if (localStorage.getItem("isLoggedIn") === "true") {
    // check if client exists
    if (!client) {
      client = makeApolloClient();
    }
    return (
      <ApolloProvider client={client}>
        <Component {...renderProps} auth={auth} client={client} />
      </ApolloProvider>
    );
  } else {
    // not logged in already, hence redirect to login page
    if (renderProps.match.path !== "/") {
      window.location.href = "/";
    } else {
      return <Component auth={auth} {...renderProps} />;
    }
  }
};

const handleAuthentication = ({ location }) => {
  if (/access_token|id_token|error/.test(location.hash)) {
    auth.handleAuthentication();
  }
};

export const makeMainRoutes = () => {
  return (
    <Router history={history}>
      <div>
        <Route
          exact
          path="/"
          render={props => provideClient(LandingPage, props)}
        />
        <Route
          exact
          path="/home"
          render={props => provideClient(Home, props)}
        />
        <Route
          exact
          path="/blog"
          render={props => provideClient(BlogPage, props)}
        />
        <Route
          path="/callback"
          render={props => {
            handleAuthentication(props);
            return <Callback {...props} />;
          }}
        />
      </div>
    </Router>
  );
};
