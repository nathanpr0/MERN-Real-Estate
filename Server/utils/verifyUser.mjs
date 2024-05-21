import jwt from "jsonwebtoken";

export default function verifyToken(req, res, next) {
  const token = req.cookies["Access_Token"];

  // CHECK IF THE TOKEN IS STILL AVAIBLE OR MISSING
  if (!token) {
    return res.status(401).json({ error: "Unauthorized: Access Token is missing" });
  }
  // THEN VERIFY THE TOKEN IF MATCH WITH THE USER ID
  else {
    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
      if (err) {
        if (err.name === "TokenExpiredError") {
          res.clearCookie("Access_Token");
          res.status(403).json({ error: "Forbidden: Access Token has expired" });
        }
        return res.status(403).json({ error: "Forbidden: Invalid Access Token" });
      }

      // STORE THE VERIFICATION RESULT THEN PROCEED TO THE NEXT MIDDLEWARE REQUEST TO SERVER
      req.user = decoded;
      next();
    });
  }
}
