const prisma = require("../lib/prisma");

// Start exam — creates session with startedAt timestamp
const startExam = async (req, res) => {
  try {
    const testId = Number(req.params.testId);
    const candidateId = req.user.id;
    const { assignedSet = 1 } = req.body;

    // Check if already submitted
    const submission = await prisma.examSubmission.findUnique({
      where: { testId_candidateId: { testId, candidateId } },
    });
    if (submission) {
      return res.status(409).json({ message: "Already submitted" });
    }

    // Upsert session — if they refresh, keep original startedAt
    const session = await prisma.examSession.upsert({
      where: { testId_candidateId: { testId, candidateId } },
      update: {}, // don't update startedAt on refresh
      create: { testId, candidateId, assignedSet },
    });

    res.json({ session });
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

// Submit exam
const submitExam = async (req, res) => {
  try {
    const testId = Number(req.params.testId);
    const candidateId = req.user.id;
    const candidateEmail = req.user.email;
    const { answers = [], assignedSet = 1 } = req.body;

    const existing = await prisma.examSubmission.findUnique({
      where: { testId_candidateId: { testId, candidateId } },
    });
    if (existing) {
      return res.status(409).json({ message: "Already submitted", submission: existing });
    }

    const submission = await prisma.examSubmission.create({
      data: { testId, candidateId, candidateEmail, answers, assignedSet },
    });

    res.status(201).json({ message: "Submitted", submission });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: err.message });
  }
};

// Grade helper — only grades questions from assigned set
function gradeQuestions(questions, answers, assignedSet, questionSetCount) {
  const setQuestions = questionSetCount > 1
    ? questions.filter((q) => q.setNumber === assignedSet)
    : questions;

  return setQuestions.map((q) => {
    const submitted = answers.find((a) => a.questionId === q.id);
    let isCorrect = null;

    if (q.type === 'MCQ' || q.type === 'Radio') {
      const correctIndices = (q.options || [])
        .map((o, i) => (o.correct ? i : -1))
        .filter((i) => i !== -1);
      const submittedIndices = submitted?.answer
        ? (Array.isArray(submitted.answer) ? submitted.answer : [submitted.answer]).map(Number)
        : [];
      isCorrect = correctIndices.length > 0 &&
        correctIndices.length === submittedIndices.length &&
        correctIndices.every((i) => submittedIndices.includes(i));
    } else if (q.type === 'Text') {
      const answer = submitted?.answer;
      isCorrect = typeof answer === 'string' && answer.trim().length > 0;
    }

    return {
      id: q.id, text: q.text, type: q.type, points: q.points,
      options: q.options, submittedAnswer: submitted?.answer ?? null, isCorrect,
    };
  });
}

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

    const graded = gradeQuestions(test.questions, submission.answers, submission.assignedSet, test.questionSet || 1);
    const score = graded.reduce((sum, q) => sum + (q.isCorrect ? q.points : 0), 0);
    const totalPoints = graded.reduce((sum, q) => sum + q.points, 0);

    res.json({ submission, graded, score, totalPoints });
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

    const graded = gradeQuestions(test.questions, submission.answers, submission.assignedSet, test.questionSet || 1);
    const score = graded.reduce((sum, q) => sum + (q.isCorrect ? q.points : 0), 0);
    const totalPoints = graded.reduce((sum, q) => sum + q.points, 0);

    res.json({ submission, graded, score, totalPoints, candidateEmail: submission.candidateEmail });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: err.message });
  }
};

module.exports = { startExam, checkSubmission, submitExam, getMyResult, getCandidates, getSubmissionDetail };
