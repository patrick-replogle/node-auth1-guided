const bcrypt = require("bcryptjs");
const db = require("../database/dbConfig.js");

module.exports = {
  add,
  find,
  findBy,
  findById
};

function find() {
  return db("users").select("id", "username");
}

function findBy(filter) {
  return db("users")
    .select("id", "username", "password")
    .where(filter);
}

function add(user) {
  return db("users")
    .insert(user, "id")
    .then(ids => {
      const [id] = ids;
      return findById(id);
    });
}

//async add model
// async function add(user) {
//   user.password = await bcrypt.hash(user.password, 14); // rounds is 2^14 === 16,384

//   const [id] = await db("users").insert(user);
//   return findById(id);
// }

function findById(id) {
  return db("users")
    .select("id", "username")
    .where({ id })
    .first();
}
