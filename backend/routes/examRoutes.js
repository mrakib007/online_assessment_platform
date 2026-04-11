const express = require("express");
const auth = require("../middleware/auth");
const { submitExam, getMyResult, getCandidates, getSubmissionDetail } = require("../controllers/examController");

const router = express.Router();

router.post("/:testId/submit", auth, submitExam);
router.get("/:testId/result", auth, getMyResult);
router.get("/:testId/candidates", auth, getCandidates);
router.get("/:testId/candidates/:candidateId", auth, getSubmissionDetail);

module.exports = router;
