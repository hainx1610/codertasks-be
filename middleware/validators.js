const { checkSchema, validationResult } = require("express-validator");

const userInputSchema = {
  name: {
    notEmpty: { errorMessage: "Name is required bro!" },
    isString: { errorMessage: "Name must be a string bro!" },
  },
};

const taskInputSchema = {};

const userValidator = [
  checkSchema(userInputSchema),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty())
      return res.status(400).json({ errors: errors.array() });
    next();
  },
];

const taskValidator = [];

module.exports = { userValidator, taskValidator };
