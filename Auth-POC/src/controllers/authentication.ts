import { Request, Response } from "express";
import { AuthenticationClient } from "auth0";

export const AuthController = (auth0: AuthenticationClient) => {
  return {
    signupHandler: async (req: Request, res: Response): Promise<void> => {
      const { email, password, firstName, lastName } = req.body;

      if (!email || !password || !firstName || !lastName) {
        res.status(400).json({ error: "All fields are required" });
      }

      try {
        const createUserResponse = await auth0.database.signUp({
          email,
          password,
          connection: "Username-Password-Authentication", // Default Auth0 connection for username-password
          user_metadata: { firstName, lastName },
        });

        res.status(201).json({
          message: "User created successfully",
          user: createUserResponse.data,
        });
      } catch (err: any) {
        console.error("Error creating user", err);
        res
          .status(500)
          .json({ error: "Failed to create user", details: err.message });
      }
    },
    signinHandler: async (req: Request, res: Response): Promise<void> => {
      try {
        const { email, password } = req.body;

        if (!email || !password) {
          res.status(400).json({ error: "Email and password are required" });
        }

        const tokenResponse = await auth0.oauth.passwordGrant({
          username: email,
          password,
          realm: "Username-Password-Authentication",

          client_id: process.env.AUTH0_CLIENT_ID,
          client_secret: process.env.AUTH0_CLIENT_SECRET,
          scope: "openid profile email", // Define the scope of the access request
          audience: `https://${process.env.AUTH0_DOMAIN}/api/v2/`, // Define your API audience
        });

        const { id_token } = tokenResponse.data;

        res.status(200).json({ access_token: id_token });
      } catch (err) {
        console.error(err);
        res.status(500).json({
          message: "Failed to sign in",
        });
      }
    },
  };
};
