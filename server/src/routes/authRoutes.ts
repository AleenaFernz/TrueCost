import express, { Request, Response } from "express";
import { signup, login } from "../controllers/authController";

const router = express.Router();

console.log("✅ Auth router initialized");

router.post("/signup", async (req: Request, res: Response) => {
  console.log("🟢 Received signup POST");
  return signup(req, res);
});

router.post("/login", async (req: Request, res: Response) => {
  console.log("🟢 Received login POST");
  return login(req, res);
});

export default router;
