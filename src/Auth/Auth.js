import auth0 from "auth0-js";

const REDIRECT_ON_LOGIN = "redirect_on_login";

export default class Auth {
  constructor(history) {
    this.history = history;
    this.userProfile = null;
    this.requestedScopes = "openid profile email read:courses";
    this.auth0 = new auth0.WebAuth({
      domain: process.env.REACT_APP_AUTH0_DOMAIN,
      clientID: process.env.REACT_APP_AUTH0_CLIENT_ID,
      redirectUri: process.env.REACT_APP_AUTH0_CALLBACK_URL,
      audience: process.env.REACT_APP_AUTH0_AUDIENCE,
      responseType: "token id_token", // specifies the response type that we want to get back when a user is authenticated.
      scope: this.requestedScopes
    });
  }

  login = () => {
    localStorage.setItem(REDIRECT_ON_LOGIN, JSON.stringify(this.history.location));
    this.auth0.authorize();
  };

  handleAuthentication = () => {
    this.auth0.parseHash((err, authResult) => {
      if (authResult && authResult.accessToken && authResult.idToken) {
        debugger;
        this.setSession(authResult);
        const redirectLocation = localStorage.getItem(REDIRECT_ON_LOGIN) === "undefined" ? "/" : JSON.parse(localStorage.getItem(REDIRECT_ON_LOGIN)); 
        this.history.push(redirectLocation);
      } else if (err) {
        this.history.push("/");
        alert(`Error: ${err.error}. Check the console for further details.`);
        console.log(err);
      };

      localStorage.removeItem(REDIRECT_ON_LOGIN);
    })
  };

  setSession = authResult => {
    console.log('AUTH RESULT', authResult);
    // set the time that the access token will expire
    const expiresAt = JSON.stringify(authResult.expiresIn * 1000 + new Date().getTime());

    // If there is a value o the `scope` param from the aurResult => use it to set scopes in the session for the user.
    // Otherwise use the scopes as requested. If no scopes were requested, set it to nothing
    const scopes = authResult.scope || this.requestedScopes || '';
    
    localStorage.setItem("access_token", authResult.accessToken);
    localStorage.setItem("id_token", authResult.idToken);
    localStorage.setItem("expires_at", expiresAt);
    localStorage.setItem("scopes", JSON.stringify(scopes));
  };

  isAuthenticated() {
    const expiresAt = JSON.parse(localStorage.getItem("expires_at"));
    return new Date().getTime() < expiresAt;
  };

  logout = () => {
    localStorage.removeItem("acces_token");
    localStorage.removeItem("id_token");
    localStorage.removeItem("expires_at");
    localStorage.removeItem("scopes");
    this.userProfile = null;
    // this.history.push("/");
    this.auth0.logout({
      clientID: process.env.REACT_APP_AUTH0_CLIENT_ID,
      returnTo: "http://localhost:3000"
    })
  };

  getAccessToken = () => {
    const accessToken = localStorage.getItem("access_token");
    if (!accessToken) {
      throw new Error("No access token found.");
    }
    
    return accessToken;
  };

  getProfile = cb => {
    if (this.userProfile) return cb(this.userProfile);
    // if we dont have a user profile then we will call the userInfo endpoint on auth0
    this.auth0.client.userInfo(this.getAccessToken(), (err, profile) => {
      if (profile) this.userProfile = profile;
      cb(profile, err);
    });
  };

  userHasScopes(scopes) {
    const grantedScopes = (
      JSON.parse(localStorage.getItem("scopes")) || ""
    ).split(" ");

    return scopes.every(scope => grantedScopes.includes(scope));
  }
}
