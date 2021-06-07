const express = require('express');
require('dotenv').config();
const jwt = require("express-jwt"); // validate jwt and ser req.user
const jwksRsa = require("jwks-rsa"); // retrieve rsa keys from a json web key set (jwks) endpont
const checkScope = require("express-jwt-authz"); // Validate JWT scopes

// validates that the info inside the jwt is valid and ensures that it was generated by auth0 -> uses the public signing key that auth0 exposes for our domain
// validating a jwt: 2 steps -> #verify signature #validate claims  
var checkJwt = jwt({
  // dinamically provide a signing key based on the kid in the header
  // and the signing keys provided by the JWKS endpoint.
  secret: jwksRsa.expressJwtSecret({
      cache: true,
      rateLimit: true,
      jwksRequestsPerMinute: 5,
      jwksUri: `https://${process.env.REACT_APP_AUTH0_DOMAIN}/.well-known/jwks.json`
}),
// validates the audience and the issuer
audience: process.env.REACT_APP_AUTH0_AUDIENCE,
issuer: `https://${process.env.REACT_APP_AUTH0_DOMAIN}/`,
// this must match the algorithm selected in the auth0 dashboard (app's advanced settings)
algorithms: ['RS256']
});

const app = express();

app.get(`/public`, (req, res) => {
  res.json({
    message: "Hello from a public API"
  });
});

app.get(`/private`, checkJwt, (req, res) => {
  res.json({
    message: "Hello from a private API"
  });
});

app.get(`/courses`, checkJwt, checkScope(["read:courses"]), (req, res) => {
  res.json({
    courses: [
      { id: 1, title: "curso1"},
      { id: 2, title: "curso2"}
    ]
  });
});

app.listen(3001, () => {
  console.log(`API server listening on ${process.env.REACT_APP_API_URL}`);
});
