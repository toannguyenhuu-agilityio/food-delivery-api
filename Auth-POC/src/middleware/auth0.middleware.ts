import dotenv from "dotenv";
import { AuthenticationClient } from "auth0";
import jwt from "jsonwebtoken";
import { Response, NextFunction } from "express";

// utils
import { getKey } from "../utils/auth.ts";

dotenv.config();

const auth0 = new AuthenticationClient({
  domain: process.env.AUTH0_DOMAIN || "", // e.g. 'your-tenant.auth0.com'
  clientId: process.env.AUTH0_CLIENT_ID || "", // Your Auth0 client ID
  clientSecret: process.env.AUTH0_CLIENT_SECRET || "", // Your Auth0 client secret
});

// Helper function to check JWT validity (protected route middleware)
const checkJwt = async (
  req: any,
  res: Response,
  next: NextFunction
): Promise<void> => {
  const token = (req.headers as unknown as Record<string, string>)[
    "authorization"
  ]?.split(" ")[1];

  if (!token) {
    res.status(401).json({ error: "Access token required" });
  }

  try {
    // Decode the JWT header to get the kid (key ID)
    const decodedHeader = jwt.decode(token, { complete: true })?.header;

    if (!decodedHeader?.kid) {
      res.status(401).json({ error: "Invalid token: Missing key ID (kid)" });
    }

    // Get the signing key
    const signingKey = await getKey(decodedHeader);

    // Verify the token with the signing key
    const decoded = jwt.verify(token, signingKey, {
      audience: process.env.AUTH0_CLIENT_ID, // Ensure audience matches client ID
      issuer: `https://${process.env.AUTH0_DOMAIN}/`,
      algorithms: ["RS256"],
    });

    // Attach the decoded JWT to the request
    req.user = decoded;
    next();
  } catch (error) {
    res.status(401).json({ error: "Invalid or expired token" });
  }
};

export { auth0, checkJwt };
