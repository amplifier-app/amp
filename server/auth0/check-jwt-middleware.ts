const jwt = require("express-jwt");
const jwksRsa = require("jwks-rsa");

const domain = process.env.AUTH0_DOMAIN;
const audience = process.env.ISSUER_BASE_URL;

if (!audience) throw new Error(".env is missing the definition of an AUTH0_AUDIENCE environmental variable");

if (!domain) throw new Error(".env is missing the definition of an AUTH0_DOMAIN environmental variable");

const checkJwt = jwt({
    secret: jwksRsa.expressJwtSecret({
        cache: true,
        rateLimit: true,
        jwksRequestsPerMinute: 5,
        jwksUri: `https://${domain}/.well-known/jwks.json`,
    }),
    audience: audience,
    issuer: `https://${domain}/`,
    algorithms: ["RS256"],
});

export default checkJwt