const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const config = require("../config/config");

const userSchema = new Schema(
  {
    email: String,
    password: String,
    subscription: {
      type: String,
      enum: ["free", "pro", "premium"],
      default: "free"
    },
    token: {
      type: String,
      default: null
    }
  },
  {
    timestamps: true
  }
);

userSchema.methods.getPublicFields = function() {
  const returnObject = {
    token: this.token,
    user: {
      email: this.email,
      subscription: this.subscription
    }
  };
  return returnObject;
};

userSchema.pre("save", function(next) {
  const user = this;

  if (
    // eslint-disable-next-line no-extra-parens
    (user.password && this.isModified("password")) ||
    // eslint-disable-next-line no-extra-parens
    (user.password && this.isNew)
  )
    bcrypt.genSalt(10, (err, salt) => {
      if (err) return next(err);

      bcrypt.hash(user.password, salt, (err, hash) => {
        if (err) return next(err);

        user.password = hash;
        next();
      });
    });
  else return next();
});

userSchema.methods.validatePassword = function(password) {
  const compare = bcrypt.compareSync(password, this.password);
  return compare;
};

userSchema.methods.getJWT = function() {
  const preToken = jwt.sign({ id: this._id }, config.secretJwtKey, {
    expiresIn: 130
  });
  const token = preToken;
  this.token = token;
  this.save();
  return token;
};

module.exports = Users = mongoose.model("Users", userSchema, "users");
