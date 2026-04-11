const express = require("express");
const auth = require("../middleware/auth");
const { submitExam, getSubmission } = require("../controllers/examController");

const router = express.Router();

router.post("/:testId/submit", auth, submitExam);
router.get("/:testId/submission", auth, getSubmission);

module.exports = router;
