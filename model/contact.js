const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const contactSchema = new Schema(
  {
    name: String,
    email: {
      type: String,
      trim: true,
      lowercase: true,
      validate: () => console.log(this),
      index: true,
      unique: true
    },
    phone: {
      type: String,
      maxlength: 14,
      minlength: 7
    }
  },
  {
    timestamps: true
  }
);

const Contact = mongoose.model("Contact", contactSchema, "contacts");

module.exports = Contact;
