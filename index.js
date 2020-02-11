const argv = require("yargs").argv;
const express = require("express");
const app = express();
const logger = require("morgan");
const cors = require("cors");
// const shortid = require("shortid");
// const {
//   listContacts,
//   getContactById,
//   removeContact,
//   addContact,
//   updateContact
// } = require("./contacts");
const dbConnection = require("./db/dbconnection");
const Contact = require("./model/contact");
const config = require("./config/config");
dbConnection();

if (config.mode === "development") {
  app.use(logger("dev"));
}

app.use(cors("*"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

/*GET /api/contacts
a
ничего не получает
вызывает функцию listContacts для работы с json-файлом contacts.json
возвращает массив всех контактов в json-формате со статусом 200*/
// app.get("/api/contacts", (req, res) => {
//   const contacts = listContacts();
//   res.status(200).json(contacts);
// });
app.get("/api/contacts", async (req, res) => {
  try {
    const contacts = await Contact.find();
    res.json(contacts);
  } catch (error) {
    res.status(400).json({ error: error });
  }
});

/* GET /api/contacts/:contactId
Не получает body
Получает параметр contactId
вызывает функцию getById для работы с json-файлом contacts.json
если такой id есть, возвращает обьект контакта в json-формате со статусом 200
если такого id нет, возвращает json с ключом "message": "Not found" и статусом 404*/
// app.get("/api/contacts/:contactId", (req, res) => {
//   const id = req.params.contactId;
//   const contact = getContactById(id);
//   if (!contact) {
//     return res.status(404).json({ message: "Not found" });
//   }
//   return res.status(200).json(contact);
// });
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

/* POST /api/contacts
Получает body в формате {name, email, phone}
Если в body нет каких-то обязательных полей, возарщает json с ключом {"message": "missing required name field"} и статусом 400
Если с body все хорошо, добавляет уникальный идентификатор в обьект контакта
Вызывает функцию addContact() для сохранения контакта в файле contacts.json
По результату работы функции возвращает обьект с добавленным id {id, name, email, phone} и статусом 201*/
// app.post("/api/contacts", (req, res) => {
//   const { name, email, phone } = req.body;
//   if (!name || !email || !phone) {
//     return res.status(400).json({ message: "missing required name field" });
//   }
//   const newContact = { id: shortid.generate(), name, email, phone };
//   addContact(newContact);

//   res.status(201).json(newContact);
// });
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

/* DELETE /api/contacts/:contactId
Не получает body
Получает параметр contactId
вызывает функцию removeContact для работы с json-файлом contacts.json
если такой id есть, возвращает json формата {"message": "contact deleted"} и статусом 200
если такого id нет, возвращает json с ключом "message": "Not found" и статусом 404*/
// app.delete("/api/contacts/:contactId", (req, res) => {
//   const id = req.params.contactId;
//   removeContact(id);
//   if (!id) {
//     return res.status(404).json({ message: "Not found" });
//   }
//   return res.status(200).json({ message: "contact deleted" });
// });
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

/* PATCH /api/contacts/:contactId
Получает body в json-формате c обновлением любых полей name, email и phone
Если body нет, возарщает json с ключом {"message": "missing fields"} и статусом 400
Если с body все хорошо, вызывает функцию updateContact(id) (напиши ее) для обновления контакта в файле contacts.json
По результату работы функции возвращает обновленный обьект контакта и статусом 200. В противном случае, возвращает json с ключом "message": "Not found" и статусом 404*/
// app.patch("/api/contacts/:contactId", (req, res) => {
//   const id = req.params.contactId;
//   const { name, email, phone } = req.body;

//   if (!name || !email || !phone) {
//     return res.status(400).json({ message: "missing fields" });
//   }

//   const update = updateContact(id, { name, email, phone });

//   if (!update) {
//     return res.status(404).json({ message: "Not found" });
//   }
//   return res.status(200).json(update);
// });
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
