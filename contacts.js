const path = require("path");
const fs = require("fs");
const shortid = require("shortid");

const contactsPath = path.resolve(__dirname, "db", "contacts.json");

// TODO: задокументировать каждую функцию
function listContacts() {
  // console.log("contactsPath:", contactsPath);
  return JSON.parse(fs.readFileSync(contactsPath));
  // console.table(listContacts);
}

function getContactById(contactId) {
  const listContacts = JSON.parse(fs.readFileSync(contactsPath));
  const contactById = listContacts.find(item => String(item.id) === contactId);
  return contactById;
}

function removeContact(contactId) {
  fs.readFile(contactsPath, (err, data) => {
    if (err) throw err;
    const listContacts = JSON.parse(data);
    return listContacts.filter(item => item.id !== contactId);
  });
}

function addContact({ id, name, email, phone }) {
  listContacts = JSON.parse(fs.readFileSync(contactsPath));
  // console.log(typeof listContacts);
  listContacts.push({
    id,
    name,
    email,
    phone
  });
  // console.log("new list:", listContacts);
  const jsonListContact = JSON.stringify(listContacts);
  fs.writeFile(contactsPath, jsonListContact, err => {
    if (err) throw err;
    console.log(`Add new contact ${name}`);
  });
}

function updateContact(contactId, { name, email, phone }) {
  let contact = getContactById(contactId);
  if (contact) {
    contact = { ...contact, ...{ name, email, phone } };
    return contact;
  }
}

module.exports = {
  listContacts,
  getContactById,
  removeContact,
  addContact,
  updateContact
};
