import history from "../../utils/history";
import auth0 from "auth0-js";
import { AUTH_CONFIG } from "./auth0-variables";

class Auth {
  auth0 = new auth0.WebAuth({
    domain: AUTH_CONFIG.domain,
    clientID: AUTH_CONFIG.clientId,
    redirectUri: AUTH_CONFIG.callbackUrl,
    responseType: "token id_token",
    scope: "openid profile"
  });
  constructor() {
    this.accessToken = null;
    this.idToken = null;
    this.expiresAt = null;
    this.sub = null;
    this.login = this.login.bind(this);
    this.logout = this.logout.bind(this);
    this.handleAuthentication = this.handleAuthentication.bind(this);
    this.isAuthenticated = this.isAuthenticated.bind(this);
    this.getAccessToken = this.getAccessToken.bind(this);
    this.getIdToken = this.getIdToken.bind(this);
    this.renewSession = this.renewSession.bind(this);
  }

  login() {
    this.auth0.authorize();
  }

  handleAuthentication = () => {
    this.auth0.parseHash((err, authResult) => {
      if (authResult && authResult.accessToken && authResult.idToken) {
        this.setSession(authResult);
        // store in db
        this.auth0.client.userInfo(authResult.accessToken, function(err, user) {
          // Now you have the user's information
          // The code to insert this user info to db has been handled at Auth0 Rule
        });
      } else if (err) {
        history.replace("/home");
        // window.location.href="/home";
        console.error(err);
        alert(`Error: ${err.error}. Check the console for further details.`);
      }
    });
  };

  setSession(authResult, redireciona = true) {
    // Set isLoggedIn flag in localStorage
    localStorage.setItem("isLoggedIn", "true");

    // Set the time that the access token will expire at
    let expiresAt = authResult.expiresIn * 1000 + new Date().getTime();
    this.accessToken = authResult.accessToken;
    this.idToken = authResult.idToken;
    this.expiresAt = expiresAt;
    this.sub = authResult.idTokenPayload.sub;
    this.picture = authResult.idTokenPayload.picture;
    this.roles =
      authResult.idTokenPayload["https://hasura.io/jwt/claims/roles"];

    localStorage.setItem("auth0:access_token", this.accessToken);
    localStorage.setItem("auth0:id_token", this.idToken);
    localStorage.setItem("auth0:expires_at", this.expiresAt);
    localStorage.setItem("auth0:id_token:sub", this.sub);
    localStorage.setItem("auth0:id_token:picture", this.picture);
    localStorage.setItem("roles", this.roles);
    // navigate to the home route
    if (redireciona) history.replace("/home");
    // window.location.href="/home";
  }

  getAccessToken() {
    return this.accessToken;
  }

  getIdToken() {
    return this.idToken;
  }

  //Serve para mostrar a role do próprio usuário já se encontra no header
  getRoles() {
    let role = "";
    if (localStorage.getItem("roles")) role = localStorage.getItem("roles");
    else role = "Usuário";

    if (role) role = role.charAt(0).toUpperCase() + role.slice(1);

    return role;
  }

  getSub() {
    if (localStorage.getItem("auth0:id_token:sub"))
      return localStorage.getItem("auth0:id_token:sub");
    return this.sub;
  }

  renewSession() {
    const _this = this;
    return new Promise((resolve, reject) => {
      _this.auth0.checkSession({}, (err, authResult) => {
        if (authResult && authResult.accessToken && authResult.idToken) {
          _this.setSession(authResult, false);
          resolve(authResult);
        } else if (err) {
          _this.logout();
          reject(err);
        }
      });
    });
  }

  logout() {
    // Remove tokens and expiry time
    this.accessToken = null;
    this.idToken = null;
    this.expiresAt = 0;

    // Remove isLoggedIn flag from localStorage
    localStorage.removeItem("isLoggedIn");
    localStorage.clear();
    // navigate to the home route
    history.replace("/");
    // window.location.href="/home";
  }

  isAuthenticated() {
    // Check whether the current time is past the
    // access token's expiry time
    let expiresAt = this.expiresAt;
    return new Date().getTime() < expiresAt;
  }
}

const auth = new Auth();

export default auth;
