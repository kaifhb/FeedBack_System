const mongoose = require("mongoose");
const Feedback = require("../models/Feedback");

exports.createFeedback = async (req, res) => {
  try {
    const feedback = new Feedback(req.body);
    const saved = await feedback.save();
    res.status(201).json(saved);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

exports.getFeedback = async (req, res) => {
  const { sortBy, order, category } = req.query;
  const filter = {};
  if (category && category.trim() !== "") {
    // Support multiple categories (e.g., "suggestion,bug")
    const categories = category.split(",").filter((c) => c.trim() !== "");
    if (categories.length > 0) {
      filter.category = { $in: categories };
    }
  }
  const sort = {};
  if (sortBy) {
    // Support multiple sort fields (e.g., "timestamp,-name")
    const sortFields = sortBy.split(",");
    sortFields.forEach((field) => {
      const isDesc = field.startsWith("-");
      const cleanField = isDesc ? field.slice(1) : field;
      sort[cleanField] = isDesc ? -1 : order === "desc" ? -1 : 1;
    });
  }
  try {
    const feedbacks = await Feedback.find(filter).sort(sort);
    res.json(feedbacks);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getFeedbackStats = async (req, res) => {
  try {
    const stats = await Feedback.aggregate([
      {
        $group: {
          _id: "$category",
          count: { $sum: 1 },
        },
      },
      {
        $project: {
          category: "$_id",
          count: 1,
          _id: 0,
        },
      },
    ]);
    res.json(stats);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
