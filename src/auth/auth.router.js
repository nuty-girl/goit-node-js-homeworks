const express = require("express");
const router = express.Router();
const checkToken = require("../../middleware/checkToken");

const login = require("./login");
const register = require("./register");
const logout = require("./logout");
const current = require("./current");

router.post("/login", checkToken, login);
router.post("/register", register);
router.post("/logout", checkToken, logout);
router.get("/current", checkToken, current);

module.exports = router;
