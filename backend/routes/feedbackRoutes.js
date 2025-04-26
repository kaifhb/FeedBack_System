const express = require("express");
const router = express.Router();
const { createFeedback, getFeedback, getFeedbackStats } = require("./feedback");

router.post("/feedback", createFeedback);
router.get("/feedback", getFeedback);
router.get("/feedback/stats", getFeedbackStats);

module.exports = router;
