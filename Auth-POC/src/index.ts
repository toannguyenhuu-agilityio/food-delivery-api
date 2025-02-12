import express, { Request, Response } from "express";
import dotenv from "dotenv";

// Middlewares
import { auth0, checkJwt } from "./middleware/auth0.middleware.ts";

// Controllers
import { AuthController } from "./controllers/authentication.ts";

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

// Function to get the signing key from JWKS

// Middleware to parse JSON
app.use(express.json());

// Not protected route
app.get("/", (req, res) => {
  res.send("Welcome to the Food Delivery App");
});
app.post("/signup", AuthController(auth0).signupHandler);

app.post("/signin", AuthController(auth0).signinHandler);

// Order route (protected by Auth0)
app.post("/order", checkJwt, (req: Request, res: Response): void => {
  const { foodItem, quantity } = req.body;

  if (!foodItem || !quantity) {
    res.status(400).json({ error: "Food item and quantity are required" });
  }

  // Simulate creating an order (in a real app, you'd interact with a database)
  const order = {
    orderId: Date.now(),
    foodItem,
    quantity,
    status: "Processing",
  };

  res.status(201).json({ message: "Order created", order });
});

// List of orders route (protected by Auth0)
app.get("/orders", checkJwt, (req: Request, res: Response): void => {
  // For simplicity, this is a mock of previous orders
  const mockOrders = [
    { orderId: 123, foodItem: "Pizza", quantity: 2, status: "Delivered" },
    { orderId: 124, foodItem: "Burger", quantity: 1, status: "Processing" },
  ];

  res.json(mockOrders);
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
