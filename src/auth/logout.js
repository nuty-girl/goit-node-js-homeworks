const Users = require("../../model/user");

module.exports = async (req, res) => {
  try {
    const body = req.body;

    const user = await Users.findOne({ email: body.email });

    if (!user) {
      res.status(401).json({ message: "Not authorized" });
    } else {
      const passwordComparre = user.validatePassword(body.password);

      user.getJWT();

      passwordComparre
        ? res.status(200).json({ message: "Logout success" })
        : res.status(401).json({ message: "Not authorized" });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
