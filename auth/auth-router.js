const bcrypt = require("bcryptjs");
const router = require("express").Router();

const Users = require("../users/users-model.js");

// /api/auth/register
router.post("/register", (req, res) => {
  let user = req.body;

  const hash = bcrypt.hashSync(user.password, 14);
  user.password = hash;

  Users.add(user)
    .then(saved => {
      res.status(201).json(saved);
    })
    .catch(error => {
      res.status(500).json(error);
    });
});

router.post("/login", (req, res) => {
  let { username, password } = req.body;

  Users.findBy({ username })
    .first()
    .then(user => {
      if (user && bcrypt.compareSync(password, user.password)) {
        res.status(200).json({
          message: `Welcome ${user.username}!`,
          id: user.id,
          username: user.username
        });
      } else {
        res.status(401).json({ message: "Invalid Credentials" });
      }
    })
    .catch(error => {
      res.status(500).json(error);
    });
});

//async versions of register and login in below
// router.post("/register", async (req, res, next) => {
//   try {
//     const saved = await Users.add(req.body);

//     res.status(201).json(saved);
//   } catch (err) {
//     next(err);
//   }
// });

// router.post("/login", async (req, res, next) => {
//   try {
//     const { username, password } = req.body;
//     const user = await Users.findBy({ username }).first();
//     const passwordValid = await bcrypt.compare(password, user.password);

//     if (user && passwordValid) {
//       res.status(200).json({ message: `Welcome ${user.username}` });
//     } else {
//       res.status(401).json({ message: "Invalid credentials" });
//     }
//   } catch (err) {
//     next(err);
//   }
// });

module.exports = router;
