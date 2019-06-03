import ApolloClient from "apollo-client";
import { HttpLink } from "apollo-link-http";
import { InMemoryCache } from "apollo-cache-inmemory";
import { WebSocketLink } from "apollo-link-ws";
import { split } from "apollo-link";
import { getMainDefinition } from "apollo-utilities";
import { SubscriptionClient } from "subscriptions-transport-ws";

import { GRAPHQL_URL, REALTIME_GRAPHQL_URL } from "./utils/constants";
import auth from "./components/Auth/Auth";

const getHeaders = () => {
  const headers = {};
  let token = auth.getIdToken();

  if (
    localStorage.getItem("auth0:access_token") &&
    localStorage.getItem("auth0:id_token") &&
    localStorage.getItem("auth0:expires_at")
  ) {
    //console.log('Auth.js.constructor() IF - Data found in the localStorage');
    this.accessToken = localStorage.getItem("auth0:access_token");
    token = localStorage.getItem("auth0:id_token");
    this.expiresAt = localStorage.getItem("auth0:expires_at");
  } else {
    //console.log('Auth.js.constructor() ELSE - No data found in the localstorage ELSE');
  }

  if (token) {
    headers.authorization = `Bearer ${token}`;
  }
  //console.log(headers);
  return headers;
};

const makeApolloClient = () => {
  //console.log('Apoolo Client MADE');
  // Create an http link:
  const httpLink = new HttpLink({
    uri: GRAPHQL_URL,
    fetch,
    headers: getHeaders()
  });

  // Create a WebSocket link:
  const wsLink = new WebSocketLink(
    new SubscriptionClient(REALTIME_GRAPHQL_URL, {
      reconnect: true,
      timeout: 30000,
      connectionParams: () => {
        return { headers: getHeaders() };
      },
      connectionCallback: err => {
        if (err) {
          wsLink.subscriptionClient.close(false, false);
        }
      }
    })
  );

  // chose the link to use based on operation
  const link = split(
    // split based on operation type
    ({ query }) => {
      const { kind, operation } = getMainDefinition(query);
      return kind === "OperationDefinition" && operation === "subscription";
    },
    wsLink,
    httpLink
  );

  const client = new ApolloClient({
    link: link,
    cache: new InMemoryCache({
      addTypename: true
    })
  });

  return client;
};

export default makeApolloClient;
