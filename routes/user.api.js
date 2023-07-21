const express = require("express");
const {
  createUser,
  getUsers,
  getSingleUser,
  deleteUser,
} = require("../controllers/user.controllers");
const router = express.Router();

/**
 * @route POST api/users
 * @description Create a new user
 * @access private, manager
 * @requiredBody: name
 */
router.post("/", createUser);

/**
 * @route GET api/users
 * @description Get a list of users
 * @access private
 * @allowedQueries: name
 */
router.get("/", getUsers);

/**
 * @route GET api/users/:id
 * @description Get user by id
 * @access public
 */
router.get("/:id", getSingleUser);

/**
 * @route DELETE api/users/:id
 * @description Delete user by id
 * @access private
 */
router.delete("/:id", deleteUser);

module.exports = router;
