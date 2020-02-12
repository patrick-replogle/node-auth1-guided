const bcrypt = require("bcryptjs");
const router = require("express").Router();

const Users = require("./users-model.js");

// /api/users/
router.get("/", restricted, (req, res) => {
  Users.find()
    .then(users => {
      res.json(users);
    })
    .catch(err => res.send(err));
});

//custom middleware to protect route
function restricted(req, res, next) {
  const { username, password } = req.headers;

  if (!username || !password) {
    return res.status(401).json({ message: "Invalid credentials" });
  }

  Users.findBy({ username })
    .first()
    .then(user => {
      if (user && bcrypt.compareSync(password, user.password)) {
        next();
      } else {
        res.status(401).json({ message: "Invalid credentials" });
      }
    })
    .catch(err => {
      res.status(500).json({ message: "Error" });
    });
}

// custom authentication middleware
// function restricted() {
//   const authError = {
//     message: "Invalid credentials"
//   };
//   return async (req, res, next) => {
//     try {
//       const { username, password } = req.headers;
//       if (!username || !password) {
//         return res.status(401).json(authError);
//       }

//       const user = await Users.findBy({ username }).first();
//       if (!user) {
//         return res.status(401).json(authError);
//       }

//       const passwordValid = await bcrypt.compare(password, user.password);
//       if (!passwordValid) {
//         return res.status(401).json(authError);
//       }
//       //if we reach this point, the user is authenticated!
//       next();
//     } catch (err) {
//       next(err);
//     }
//   };
// }

module.exports = router;
