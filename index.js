const express = require("express");
const app = express();
const logger = require("morgan");
const cors = require("cors");
const dbConnection = require("./db/dbconnection");
const Contact = require("./model/contact");
const config = require("./config/config");
const authRouter = require("./src/auth/auth.router");
dbConnection();

if (config.mode === "development") {
  app.use(logger("dev"));
}

app.use(cors("*"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/api/contacts", async (req, res) => {
  try {
    const contacts = await Contact.find();
    res.json(contacts);
  } catch (error) {
    res.status(400).json({ error: error });
  }
});

app.get("/api/contacts/:contactId", (req, res) => {
  const id = req.params.contactId;
  Contact.findOne({ _id: id })
    .then(contact => {
      if (!contact) {
        return res.status(404).json({
          contact: contact,
          message: `Contact not found by this id: ${id}`
        });
      }
      res.json({ contact: contact });
    })
    .catch(error => res.status(404).json({ error: error }));
});

app.post("/api/contacts", async (req, res) => {
  try {
    const contactData = req.body;
    const newContact = new Contact(contactData);
    const result = await newContact.save();
    res.status(201).json({ contact: result });
  } catch (error) {
    res.status(400).json({ error: error });
  }
});

app.delete("/api/contacts/:contactId", (req, res) => {
  const id = req.params.contactId;
  Contact.findOneAndDelete({ _id: id })
    .then(contact => {
      if (!contact) {
        return res.status(404).json({
          contact: contact,
          message: `Contact not found by this id: ${id}`
        });
      }
      res.status(200).json({ contact: contact, message: "contact deleted" });
    })
    .catch(error => res.status(404).json({ error: error }));
});

app.patch("/api/contacts/:contactId", (req, res) => {
  const id = req.params.contactId;
  const newContactData = req.body;
  Contact.findOneAndUpdate({ _id: id }, { $set: newContactData }, { new: true })
    .then(contact => {
      if (!contact) {
        return res.status(404).json({
          contact: contact,
          message: `Contact not found by this id: ${id}`
        });
      }
      res.json({ contact: contact });
    })
    .catch(error => res.status(404).json({ error: error }));
});

app.use("/auth", authRouter);

app.use("*", (req, res) => {
  res.status(404).json({
    get_contacts: "http://localhost:5000/api/contacts",
    create_contact: "http://localhost:5000/api/contacts",
    delete_contact: "http://localhost:5000/api/contacts/:contactId"
  });
});

app.listen(config.port, () =>
  console.log(`Server running on port ${config.port}`)
);
