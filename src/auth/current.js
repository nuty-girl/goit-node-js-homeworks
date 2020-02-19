const Users = require("../../model/user");

module.exports = (req, res) => {
  console.log("req:", req);
  const user = req.user;
  console.log("user:", user);
  user.save();
  if (!user) {
    res.status(401).json({ message: "Not authorized" });
  } else {
    res
      .status(200)
      .json({ email: user.email, subscription: user.subscription });
  }
};
