const Users = require("../../model/user");

module.exports = async (req, res) => {
  try {
    const body = req.body;

    const user = await Users.findOne({ email: body.email });

    if (!user) {
      res.status(400).json({ message: "Неверный логин или пароль" });
    } else {
      const passwordComparre = user.validatePassword(body.password);

      user.getJWT();
      const respondUserData = user.getPublicFields();

      passwordComparre
        ? res.status(200).json({ ...respondUserData })
        : res.status(400).json({ message: "Неверный логин или пароль" });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
