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
  const filter = category ? { category } : {};
  const sort = {};
  if (sortBy) sort[sortBy] = order === "desc" ? -1 : 1;
  const feedbacks = await Feedback.find(filter).sort(sort);
  res.json(feedbacks);
};
