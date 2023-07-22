const mongoose = require("mongoose");
const { AppError, sendResponse } = require("../helpers/utils");
const Task = require("../models/Task");
const User = require("../models/User");

const taskController = {};

taskController.createTask = async (req, res, next) => {
  try {
    const info = req.body;
    if (!info || Object.keys(info).length === 0)
      throw new AppError(400, "Bad request", "Create task error");
    // if req.body.assignedTo ... (also, valid mongo Id?)
    const created = await Task.create(info);
    sendResponse(res, 200, true, created, null, "Create task success");
  } catch (error) {
    next(error);
  }
};

taskController.getTasks = async (req, res, next) => {
  try {
    const name = req.query.name;
    const status = req.query.status;
    const filter = { name, status };
    if (!name) delete filter.name;
    if (!status) delete filter.status;
    const tasks = await Task.find(filter)
      .sort({ createdAt: -1 })
      .populate("assignedTo", "name");
    sendResponse(res, 200, true, tasks, null, "Get all tasks success");
  } catch (error) {
    next(error);
  }
};

taskController.getSingleTask = async (req, res, next) => {
  try {
    const { id } = req.params;
    console.log(req.params);
    if (!mongoose.isValidObjectId(id)) throw new Error("Invalid ID");
    const filter = { _id: id };
    const singleTask = await Task.find(filter).populate("assignedTo", "name");
    sendResponse(res, 200, true, singleTask, null, "Get single task success");
  } catch (error) {
    next(error);
  }
};

taskController.deleteTask = async (req, res, next) => {
  try {
    const { id } = req.params;
    if (!mongoose.isValidObjectId(id)) throw new Error("Invalid ID");
    const deleted = await Task.findByIdAndUpdate(
      id,
      { isDeleted: true },
      { new: true, runValidators: true }
    );
    if (!deleted) throw new Error("Task not found!");
    sendResponse(res, 200, true, deleted, null, "Delete task success");
  } catch (error) {
    next(error);
  }
};

taskController.addReference = async (req, res, next) => {
  const { targetId } = req.params;
  const { ref } = req.body;
  try {
    let taskFound = await Task.findOne({ _id: targetId });
    //add check to control if task not found
    // console.log(taskFound);
    let userFound = await User.findById(ref);
    // console.log(taskFound, userFound);
    //add check to control if ref user not found
    taskFound.assignedTo = ref;
    //mongoose query
    taskFound = await taskFound.save();
    userFound.responsibleFor.push(taskFound);
    userFound = await userFound.save();
    sendResponse(res, 200, true, taskFound, null, "Add assignee success");
  } catch (err) {
    next(err);
  }
};

module.exports = taskController;
