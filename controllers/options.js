const Question = require("../models/question");
const Option = require("../models/option");
require("dotenv").config();
/**
 * create a option
 * takes the question id from parameters and text of option from body of request
 * check if quetionsId is valid or not if question id is valid then we create an option
 * assign link to vote dynamicaly and push option id to the question's options array
 */
module.exports.create = async function (req, res) {
  try {
    const questionId = req.params.id;
    const { text } = req.body;

    if (!questionId || !text) {
      return res.status(404).json({
        message: "Empaty Question id or option text",
        status: "error",
        data: [],
      });
    }

    const question = await Question.findById(questionId);

    if (!question) {
      return res.status(404).json({
        message: "Invalid Question id",
        status: "error",
        data: [],
      });
    }

    const baseUrl = `https://localhost:${process.env.PORT}/`;

    const option = await Option.create({
      text: text,
      question_id: question._id,
    });
    option.link_to_vote = `${baseUrl}/options/${option.id}/add_vote`;
    await option.save();

    if (!option) {
      throw new Error("unable to create option");
    }

    question.options.push(option._id);
    await question.save();

    return res.status(200).json({
      message: "Option created",
      status: "success",
      data: [option],
    });
  } catch (error) {
    console.log("CREATE OPTION ERROR: ", error);

    return res.status(500).json({
      message: "Internal Server Error",
      status: "error",
      data: [],
    });
  }
};

/**
 * delete the option
 * takes option id from parameters
 * check if option id is valid or not if it is valid
 * first remove option's id from question's options array
 * then delete the option from db
 */
module.exports.delete = async function (req, res) {
  try {
    const optionId = req.params.id;

    if (!optionId) {
      return res.status(404).json({
        message: "Empty option id recieved",
        status: "error",
        data: [],
      });
    }

    const option = await Option.findById(optionId);

    if (!option) {
      return res.status(404).json({
        message: "Invalid option id recieved",
        status: "error",
        data: [],
      });
    }

    await Question.findByIdAndUpdate(option.question_id, {
      $pull: { options: option.id },
    });
    await Option.findByIdAndDelete(optionId);

    return res.status(200).json({
      message: "Option deleted",
      status: "success",
      data: [],
    });
  } catch (error) {
    console.log("DELETE OPTION ERROR: ", error);

    return res.status(500).json({
      message: "Internal Server Error",
      status: "error",
      data: [],
    });
  }
};

/**
 * add vote to the option
 * takes option id from parameters of request
 * check if option id is valid or not if valid increate votes by 1
 * and return option object
 */
module.exports.addVote = async function (req, res) {
  try {
    const optionId = req.params.id;

    if (!optionId) {
      return res.status(404).json({
        message: "Empty option id recieved",
        status: "error",
        data: [],
      });
    }

    const option = await Option.findById(optionId);

    if (!option) {
      return res.status(404).json({
        message: "Invalid option id recieved",
        status: "error",
        data: [],
      });
    }

    option.votes++;
    await option.save();

    return res.status(200).json({
      message: "vote Increamented",
      status: "success",
      data: [option],
    });
  } catch (error) {
    console.log("ADD VOTE TO OPTION ERROR: ", error);

    return res.status(500).json({
      message: "Internal Server Error",
      status: "error",
      data: [],
    });
  }
};
