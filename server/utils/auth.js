/**
 * JWT - JSON Web Tokens are JSON object that has been encoded
 *       into a tokenized string
 *
 * Benfits - contain all the data you need encoded into a single string
 *         - eliminate the need to save a session ID on the back end or in the db
 *         -  decrease the amount of server side resources needed to main auth
 *         - can be generated anywhere and arent tied to single domain like cookies
 */

const jwt = require("jsonwebtoken");

const secret = "mysecretsshhhhh";
const expiration = "2h";

module.exports = {
  signToken: function ({ username, email, _id }) {
    const payload = { username, email, _id };

    return jwt.sign({ data: payload }, secret, { expiresIn: expiration });
  },

  // logic for working with the http headers
  authMiddleware: function ({ req }) {
    // allows token to be sent via req.body, req.query, or headers
    let token = req.body.token || req.query.token || req.headers.authorization;

    //separate "Bearer" from "<tokenvalue>"
    if (req.headers.authorization) {
      token = token.split(" ").pop().trim();
    }

    //if notekn, return request object as is
    if (!token) {
      return req;
    }

    try {
      //decode and attach user data to request object
      // secret used here to verify token sent by the user
      const { data } = jwt.verify(token, secret, { maxAge: expiration });
      req.user = data;
    } catch {
      console.log("invalid token");
    }

    //return update reqObject
    return req;
  },
};
