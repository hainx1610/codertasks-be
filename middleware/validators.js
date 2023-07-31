const { checkSchema, validationResult } = require("express-validator");

const userInputSchema = {
  name: {
    notEmpty: { bail: true, errorMessage: "Name of user is required!" },
    isString: { errorMessage: "Name of user must be a string" },
  },
  role: {
    isIn: {
      options: [["manager", "employee"]],
      errorMessage: "Invalid role",
    },
  },
};

const taskInputSchema = {
  name: {
    notEmpty: { bail: true, errorMessage: "Name of task is required!" },
    isString: { errorMessage: "Name of task must be a string" },
  },
  description: {
    notEmpty: { bail: true, errorMessage: "Task description is required!" },
    isString: { errorMessage: "Task description must be a string" },
  },
  status: {
    isIn: {
      options: [["pending", "working", "review", "done", "archive"]],
      errorMessage: "Invalid status",
    },
  },
};

const userValidator = [
  checkSchema(userInputSchema),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty())
      return res.status(400).json({ errors: errors.array() });
    next();
  },
];

const taskValidator = [
  checkSchema(taskInputSchema),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty())
      return res.status(400).json({ errors: errors.array() });
    next();
  },
];

module.exports = { userValidator, taskValidator };
