const path = require("path");
const fs = require("fs");
const shortid = require("shortid");

const contactsPath = path.resolve(__dirname, "db", "contacts.json");

// TODO: задокументировать каждую функцию
function listContacts() {
  console.log("contactsPath:", contactsPath);
  fs.readFile(contactsPath, (err, data) => {
    if (err) throw err;
    const listContacts = JSON.parse(data);
    console.table(listContacts);
  });
}

function getContactById(contactId) {
  fs.readFile(contactsPath, (err, data) => {
    if (err) throw err;
    const listContacts = JSON.parse(data);
    const contactById = listContacts.find(item => item.id === contactId);
    console.log("getContactById:", contactById);
  });
}

function removeContact(contactId) {
  fs.readFile(contactsPath, (err, data) => {
    if (err) throw err;
    const listContacts = JSON.parse(data);
    const filteredContacts = listContacts.filter(item => item.id !== contactId);
    console.log("filteredContacts:", filteredContacts);
  });
}

function addContact(name, email, phone) {
  fs.readFile(contactsPath, (err, data) => {
    if (err) throw err;
    listContacts = JSON.parse(data);
    console.log(typeof listContacts);
    listContacts.push({
      id: shortid.generate(),
      name,
      email,
      phone
    });
    console.log("new list:", listContacts);
    const jsonListContact = JSON.stringify(listContacts);
    fs.writeFile(contactsPath, jsonListContact, err => {
      if (err) throw err;
      console.log(`Add new contact ${name}`);
    });
  });
}

module.exports = { listContacts, getContactById, removeContact, addContact };
