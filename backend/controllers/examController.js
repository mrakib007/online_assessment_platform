const prisma = require("../lib/prisma");
const SetAssignmentService = require("../services/SetAssignmentService");
const GradingService = require("../services/GradingService");
const TimeSlotValidator = require("../services/TimeSlotValidator");

// Start exam — auto-assigns set, validates time slot
const startExam = async (req, res) => {
  try {
    const testId = Number(req.params.testId);
    const candidateId = req.user.id;

    // Already submitted?
    const submission = await prisma.examSubmission.findUnique({
      where: { testId_candidateId: { testId, candidateId } },
    });
    if (submission) {
      return res.status(409).json({ message: "Already submitted" });
    }

    // If session already exists, return it (refresh case)
    const existingSession = await prisma.examSession.findUnique({
      where: { testId_candidateId: { testId, candidateId } },
    });
    if (existingSession) {
      return res.json({ session: existingSession });
    }

    // Fetch test with time slots
    const test = await prisma.onlineTest.findUnique({
      where: { id: testId },
      include: { timeSlots: true },
    });
    if (!test) return res.status(404).json({ message: "Test not found" });

    // Validate time slot
    const slotResult = await TimeSlotValidator.validateTimeSlot(test.timeSlots, testId);
    if (!slotResult.valid) {
      return res.status(403).json({
        message: slotResult.message,
        reason: slotResult.reason,
        nextSlot: slotResult.nextSlot || null,
      });
    }

    // Auto-assign set via round-robin
    const assignedSet = await SetAssignmentService.assignSet(testId, test.questionSet || 1);

    const session = await prisma.examSession.create({
      data: { testId, candidateId, assignedSet },
    });

    res.json({ session, availableSlot: slotResult.slot || null });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: err.message });
  }
};

// Check submission status + session info
const checkSubmission = async (req, res) => {
  try {
    const testId = Number(req.params.testId);
    const candidateId = req.user.id;

    const submission = await prisma.examSubmission.findUnique({
      where: { testId_candidateId: { testId, candidateId } },
    });

    const session = await prisma.examSession.findUnique({
      where: { testId_candidateId: { testId, candidateId } },
    });

    res.json({
      submitted: !!submission,
      submission: submission || null,
      session: session || null,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Submit exam — reads assignedSet from session, not body
const submitExam = async (req, res) => {
  try {
    const testId = Number(req.params.testId);
    const candidateId = req.user.id;
    const candidateEmail = req.user.email;
    const { answers = [] } = req.body;

    const existing = await prisma.examSubmission.findUnique({
      where: { testId_candidateId: { testId, candidateId } },
    });
    if (existing) {
      return res.status(409).json({ message: "Already submitted", submission: existing });
    }

    // Get assignedSet from session (authoritative source)
    const session = await prisma.examSession.findUnique({
      where: { testId_candidateId: { testId, candidateId } },
    });
    const assignedSet = session?.assignedSet ?? 1;

    const submission = await prisma.examSubmission.create({
      data: { testId, candidateId, candidateEmail, answers, assignedSet },
    });

    res.status(201).json({ message: "Submitted", submission });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: err.message });
  }
};

// Candidate's own result
const getMyResult = async (req, res) => {
  try {
    const testId = Number(req.params.testId);
    const candidateId = req.user.id;

    const submission = await prisma.examSubmission.findUnique({
      where: { testId_candidateId: { testId, candidateId } },
    });
    if (!submission) return res.status(404).json({ message: "No submission found" });

    const test = await prisma.onlineTest.findUnique({
      where: { id: testId },
      include: { questions: true },
    });

    const { graded, score, totalPoints, penaltyPoints, percentage } = GradingService.gradeExam(
      test.questions,
      submission.answers,
      submission.assignedSet,
      test.questionSet || 1,
      test.negativeMarkingEnabled,
      test.negativeMarkingPenalty
    );

    res.json({ submission, graded, score, totalPoints, penaltyPoints, percentage });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: err.message });
  }
};

// All candidates for a test (employer)
const getCandidates = async (req, res) => {
  try {
    const testId = Number(req.params.testId);
    const submissions = await prisma.examSubmission.findMany({
      where: { testId },
      orderBy: { submittedAt: "desc" },
    });
    res.json(submissions);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Specific candidate submission detail (employer)
const getSubmissionDetail = async (req, res) => {
  try {
    const testId = Number(req.params.testId);
    const candidateId = Number(req.params.candidateId);

    const submission = await prisma.examSubmission.findUnique({
      where: { testId_candidateId: { testId, candidateId } },
    });
    if (!submission) return res.status(404).json({ message: "Submission not found" });

    const test = await prisma.onlineTest.findUnique({
      where: { id: testId },
      include: { questions: true },
    });

    const { graded, score, totalPoints, penaltyPoints, percentage } = GradingService.gradeExam(
      test.questions,
      submission.answers,
      submission.assignedSet,
      test.questionSet || 1,
      test.negativeMarkingEnabled,
      test.negativeMarkingPenalty
    );

    res.json({
      submission,
      graded,
      score,
      totalPoints,
      penaltyPoints,
      percentage,
      candidateEmail: submission.candidateEmail,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: err.message });
  }
};

module.exports = { startExam, checkSubmission, submitExam, getMyResult, getCandidates, getSubmissionDetail };
