const checkAuth = (req, res, next) => {
  console.log("checkAuth");
  if (req.isAuthenticated()) return next();
  res.redirect("/login");
};

export default checkAuth;
