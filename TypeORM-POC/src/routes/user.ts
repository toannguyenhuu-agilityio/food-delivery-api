import { Router } from "express";
import { User } from "../entities/user.entity.ts";
import { AppDataSource } from "../data-source.ts";

// Controllers
import { userController } from "../controllers/user.ts";

const userRepository = AppDataSource.getRepository(User);

const { getUser, getUserById, createUser, updateUser, deleteUser } =
  userController(userRepository);

const router = Router();

router.get("/users", getUser);

router.get("/users/:id", getUserById);

router.post("/users", createUser);

router.put("/users/:id", updateUser);

router.delete("/users/:id", deleteUser);

export default router;
