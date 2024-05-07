import jwt from "jsonwebtoken";

export default function verifyToken(req, res, next) {
  const token = req.cookies["Access_Token"];
  if (!token) {
    return res.status(401).json({ error: "Unauthorized: Access Token is missing" });
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) {
      if (err.name === "TokenExpiredError") {
        return res.status(403).json({ error: "Forbidden: Access Token has expired" });
      }
      return res.status(403).json({ error: "Forbidden: Invalid Access Token" });
    }

    req.user = decoded;
    next();
  });
}
