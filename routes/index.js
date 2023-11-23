const express = require("express");
const Questions = require("../models/question");
const router = express.Router();

// questions routes
router.get("/", async (req, res) => {
  const question = await Questions.find();
  res.json({
    message:
      "HOME PAGE OF POLLING SYSTEM API ONLY WORKS IN POSTMAN AND THUNDER CLIENT FOR NOW : ",
    data: question,
  });
});
router.use("/questions", require("./questions"));

// options routes
router.use("/options", require("./options"));

module.exports = router;
