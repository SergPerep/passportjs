import express from "express";
import dotenv from "dotenv";
import { connectDB } from "./db.js";
import userRouter from "./components/userRouter.js";
import path from "path";
import { fileURLToPath } from "url";
import passport from "passport";
import session from "express-session";
import { Strategy as LocalStrategy } from "passport-local";
import checkAuth from "./middlewares/checkAuth.js";
import User from "./components/userModel.js";
dotenv.config();
const app = express();
const __dirname = path.dirname(fileURLToPath(import.meta.url));

const { PORT = 5000 } = process.env;

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use(
  session({
    secret: process.env.SECRET || "secret",
    resave: false,
    saveUninitialized: true,
  })
);
app.use(passport.initialize()); // init password on every route call
app.use(passport.session()); // allow password to use 'express-session'

// Search user and authenticate
const authUser = async (email, password, done) => {
  try {
    console.log("authUser");
    const data = await User.findOne({ email: email, password });
    if (!data)
      return done(
        new Error("Cannot find user with such email and password"),
        false
      );
    let authenticated_user = { id: data._id.toString(), email: data.email };
    return done(null, authenticated_user);
  } catch (error) {
    console.error(error);
  }
};
passport.use(new LocalStrategy(authUser));

// Makes req.session.passport.user
passport.serializeUser((user, done) => {
  console.log(`-> Serialize User`);
  console.log(user);

  done(null, user);
});

// Makes req.user
passport.deserializeUser((user, done) => {
  console.log(`-> Deserialize User`);
  done(null, user);
});

app.get("/", checkAuth, (req, res) => {
  console.log("GET /");
  res.status(200).sendFile(path.join(__dirname, "./pages/dashboard.html"));
});

app.get("/login", (req, res) => {
  console.log("GET /login");
  res.status(200).sendFile(path.join(__dirname, "./pages/login.html"));
});

app.get("/signup", (req, res) => {
  console.log("GET /signup");
  res.status(200).sendFile(path.join(__dirname, "./pages/signup.html"));
});

app.use("/api/users", userRouter);

app.get("/api/logout", (req, res, next) => {
  req.logOut((err) => {
    if (err) return next(err);
    res.redirect("/login");
    console.log("-> User logged out");
  });
});

app.post(
  "/api/login",
  passport.authenticate("local", {
    successRedirect: "/",
    failureRedirect: "/signup",
  })
);

app.listen(PORT, async () => {
  await connectDB();
  console.log(`-> Server is running on ${PORT}`);
});
