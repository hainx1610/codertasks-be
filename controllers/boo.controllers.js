const { sendResponse, AppError } = require("../helpers/utils.js");

const Boo = require("../models/Boo.js");

const booController = {};

//Create a boo
booController.createBoo = async (req, res, next) => {
  const data = req.body;
  try {
    // take a look at express-validator, or keep writing ifs!
    if (!data || Object.keys(data).length === 0)
      throw new AppError(400, "Bad request", "Create boo error");
    //always remember to control your inputs

    //in real project you must also check if id (referenceTo) is valid as well as if document with given id is exist before any further process
    //mongoose query
    const created = await Boo.create(data);
    sendResponse(res, 200, true, { data: created }, null, "Create boo Success");
  } catch (err) {
    next(err);
  }
};
//updateboo
booController.addReference = async (req, res, next) => {
  //in real project you will get info from req
  const { targetName } = req.params;
  const { ref } = req.body;
  try {
    //always remember to control your inputs
    //in real project you must also check if id (referenceTo) is valid as well as if document with given id is exist before any futher process

    let found = await Boo.findOne({ name: targetName });
    //add your check to control if boo is notfound
    const refFound = await Boo.findById(ref);
    //add your check to control if foo is notfound
    found.referenceTo = ref;
    //mongoose query
    found = await found.save();
    sendResponse(
      res,
      200,
      true,
      { data: found },
      null,
      "Add reference success"
    );
  } catch (err) {
    next(err);
  }
};

//Get all boo
booController.getAllBoos = async (req, res, next) => {
  //in real project you will getting condition from from req then construct the filter object for query
  // empty filter mean get all
  const filter = {};
  try {
    //mongoose query
    const listOfFound = await Boo.find(filter).populate("referenceTo");
    //this to query data from the reference and append to found result.
    sendResponse(
      res,
      200,
      true,
      { data: listOfFound },
      null,
      "Found list of boos success"
    );
  } catch (err) {
    next(err);
  }
};

//export
module.exports = booController;
