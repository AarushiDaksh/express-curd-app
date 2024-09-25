const Task = require("../models/taskModel");

exports.getAllTask = async (req, res, next) => {
    try {
        const taskList = await Task.find();
        res.status(200).json({
            status: "success",
            count: taskList.length,
            data: {
                taskList
            }
        });
    } catch (error) {
        res.status(400).json({
            status: "failed",
            description: "Cannot get task list"
        });
    }
};

exports.createTask = async (req, res, next) => {
    try {
        const task = await Task.create(req.body);
        res.status(201).json({
            status: "success",
            data: {
                task
            }
        });
    } catch (error) {
        res.status(400).json({
            status: "failed",
            description: "Cannot create new task"
        });
    }
};

exports.getOneTask = async (req, res, next) => {
    try {
        const task = await Task.findById(req.params.id);  // Correcting this part
        if (!task) {
            return res.status(404).json({
                status: "failed",
                description: "Task not found"
            });
        }
        res.status(200).json({
            status: "success",
            data: {
                task
            }
        });
    } catch (error) {
        res.status(400).json({
            status: "failed",
            description: "Cannot get task"
        });
    }
};
