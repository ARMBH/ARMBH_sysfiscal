const HASURA_GRAPHQL_ENGINE_HOSTNAME =
  process.env.REACT_APP_HASURA_GRAPHQL_ENGINE_HOSTNAME;
const REACT_APOLLO_FRONTEND = process.env.REACT_APP_REACT_APOLLO_FRONTEND;

const scheme = proto => {
  return window.location.protocol === "https:" ? `${proto}s` : proto;
};

export const GRAPHQL_URL = `${scheme(
  "http"
)}://${HASURA_GRAPHQL_ENGINE_HOSTNAME}/v1/graphql`;
export const REALTIME_GRAPHQL_URL = `${scheme(
  "ws"
)}://${HASURA_GRAPHQL_ENGINE_HOSTNAME}/v1/graphql`;
export const authClientId = process.env.REACT_APP_AUTHCLIENTID; //Localizado em Auth0.com
export const authDomain = process.env.REACT_APP_AUTHDOMAIN;
export const callbackUrl = `${scheme(
  "http"
)}://${REACT_APOLLO_FRONTEND}/callback`;
