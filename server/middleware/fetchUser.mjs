import 'dotenv/config'
import jwt from "jsonwebtoken";
const secret_key = process.env.Secret_key;
const fetchUser = (req, res, next) => {
  // Get the user from jwt token and add it to the req object
  const token = req.header("auth-token");
  if (!token) {
    res.status(401).send({ error: "Please authenticate a valid token" });
  }
  try {
    const data = jwt.verify(token, secret_key);
    req.user = data.user;
    next();
  } catch (error) {
    res.status(401).send({ error: "Please authenticate a valid token" });
  }
};

export default fetchUser;
