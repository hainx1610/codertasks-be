const mongoose = require("mongoose");
const { AppError, sendResponse } = require("../helpers/utils");
const Task = require("../models/Task");

const taskController = {};

taskController.createTask = async (req, res, next) => {
  try {
    const info = req.body;
    if (!info || Object.keys(info).length === 0)
      throw new AppError(400, "Bad request", "Create task error");
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
    const tasks = await Task.find(filter).populate("assignedTo");
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
    const singleTask = await Task.find(filter).populate("assignedTo");
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
    let found = await Task.findOne({ _id: targetId });
    //add check to control if task not found
    console.log(found);
    const refFound = await Task.findById(ref);
    //add check to control if ref user not found
    found.assignedTo = ref;
    //mongoose query
    found = await found.save();
    sendResponse(res, 200, true, found, null, "Add assignee success");
  } catch (err) {
    next(err);
  }
};

module.exports = taskController;
