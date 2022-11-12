import { Router } from "express";
import User from "./userModel.js";
const router = Router();

router.get("/", async (req, res, next) => {
  try {
    const users = await User.find({});
    res.status(200).json(users);
  } catch (error) {
    next(error);
  }
});

router.post("/", async (req, res, next) => {
  try {
    const { email, password } = req.body;
    if (!email || !password)
      throw new Error("Missing credentials: email or password");
    const user = new User({ email, password });
    await user.save();
    console.log("User created");
    res.status(201).json({ message: "User created" });
  } catch (error) {
    console.error(error);
  }
});

export default router;
