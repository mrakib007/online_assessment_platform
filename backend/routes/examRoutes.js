const express = require("express");
const auth = require("../middleware/auth");
const { submitExam, getCandidates } = require("../controllers/examController");

const router = express.Router();

router.post("/:testId/submit", auth, submitExam);
router.get("/:testId/candidates", auth, getCandidates);

module.exports = router;
