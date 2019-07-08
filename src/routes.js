import React from "react";
import { Route, Router } from "react-router-dom";

import Home from "./components/Home/Home";
import Callback from "./components/Callback/Callback";
import auth from "./components/Auth/Auth";
import LandingPage from "./components/LandingPage/LandingPage";
import BlogPage from "./components/BlogPage/BlogPage";
import ProcessoForm from "./components/Processo/ProcessoForm";
import ProcessoUploadDoc from "./components/Processo/ProcessoUploadDoc";
import ListaProcessos from "./components/Processo/ListaProcessos";
import history from "./utils/history";

import { ApolloProvider } from "react-apollo";
import makeApolloClient from "./apollo";

import "tabler-react/dist/Tabler.css";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

// Call it once in your app. At the root of your app is the best place
toast.configure();

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
    if (renderProps.match.path !== "/login") {
      window.location.href = "/login";
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
          path="/login"
          render={props => provideClient(LandingPage, props)}
        />
        <Route exact path="/" render={props => provideClient(Home, props)} />
        <Route
          exact
          path="/home"
          render={props => provideClient(Home, props)}
        />
        <Route
          exact
          path="/home/:param"
          render={props => provideClient(Home, props)}
        />
        <Route
          exact
          path="/blog"
          render={props => provideClient(BlogPage, props)}
        />
        <Route
          exact
          path="/novoprocesso/"
          render={props => provideClient(ProcessoForm, props)}
        />
        <Route
          exact
          path="/listaprocessos/"
          render={props => provideClient(ListaProcessos, props)}
        />
        <Route
          exact
          path="/processo/:param"
          render={props => provideClient(ProcessoForm, props)}
        />
        <Route
          exact
          path="/adicionardoc/:param"
          render={props => provideClient(ProcessoUploadDoc, props)}
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
