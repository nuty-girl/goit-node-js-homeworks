const Users = require("../../model/user");

module.exports = async (req, res) => {
  try {
    const body = req.body;

    const user = await Users.findOne({ email: body.email });
    console.log("User:", user);

    if (!body.password || !body.email) {
      res.status(422).json({ message: "Missing required fields" });
    } else if (user) {
      res.status(400).json({ message: "Email in use" });
    } else {
      const user = await new Users(body);
      const result = await user.save();
      const respondUserData = user.getPublicFields();

      if (result) {
        res.status(201).json({
          ...respondUserData
        });
      }
    }
  } catch (error) {
    res.status(500).json({ registerMessage: error.message });
  }
};
