const express = require("express");
const userController = require("../controllers/userController");

const router = express.Router();

//localhost:3000
router.route("/").get(userController.getAllUsers).post(userController.createUser);

//localhost:3000/:id
router.route("/:id").get(userController.getOneUser);

module.exports = router;