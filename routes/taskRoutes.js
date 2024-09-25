const express = require("express");
const taskController = require("../controllers/taskController");

const router = express.Router();

// Routes - base URL: localhost:3000/api/v1/tasks
router.route("/")
    .get(taskController.getAllTask)   
    .post(taskController.createTask); 

router.route("/:id")
    .get(taskController.getOneTask);  

module.exports = router;
