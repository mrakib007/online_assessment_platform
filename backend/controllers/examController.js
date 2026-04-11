const prisma = require("../lib/prisma");

// Submit exam with answers
const submitExam = async (req, res) => {
  try {
    const testId = Number(req.params.testId);
    const candidateId = req.user.id;
    const candidateEmail = req.user.email;
    const { answers = [] } = req.body;

    const submission = await prisma.examSubmission.upsert({
      where: { testId_candidateId: { testId, candidateId } },
      update: { answers, submittedAt: new Date() },
      create: { testId, candidateId, candidateEmail, answers },
    });

    res.status(201).json({ message: "Submitted", submission });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: err.message });
  }
};

// Get candidate's own result with grading
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

    // Grade each question
    const graded = test.questions.map((q) => {
      const submitted = submission.answers.find((a) => a.questionId === q.id);
      let isCorrect = null;

      if (q.type === 'MCQ' || q.type === 'Radio') {
        const correctIndices = (q.options || [])
          .map((o, i) => (o.correct ? i : -1))
          .filter((i) => i !== -1);

        const submittedIndices = submitted?.answer
          ? (Array.isArray(submitted.answer) ? submitted.answer : [submitted.answer]).map(Number)
          : [];

        isCorrect = correctIndices.length === submittedIndices.length &&
          correctIndices.every((i) => submittedIndices.includes(i));
      }

      return {
        id: q.id,
        text: q.text,
        type: q.type,
        points: q.points,
        options: q.options,
        submittedAnswer: submitted?.answer ?? null,
        isCorrect,
      };
    });

    const score = graded.reduce((sum, q) => sum + (q.isCorrect ? q.points : 0), 0);
    const totalPoints = graded.reduce((sum, q) => sum + q.points, 0);

    res.json({ submission, graded, score, totalPoints });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: err.message });
  }
};

// Get all candidates for a test (employer)
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

// Get a specific candidate's submission detail (employer)
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

    const graded = test.questions.map((q) => {
      const submitted = submission.answers.find((a) => a.questionId === q.id);
      let isCorrect = null;

      if (q.type === 'MCQ' || q.type === 'Radio') {
        const correctIndices = (q.options || [])
          .map((o, i) => (o.correct ? i : -1))
          .filter((i) => i !== -1);
        const submittedIndices = submitted?.answer
          ? (Array.isArray(submitted.answer) ? submitted.answer : [submitted.answer]).map(Number)
          : [];
        isCorrect = correctIndices.length === submittedIndices.length &&
          correctIndices.every((i) => submittedIndices.includes(i));
      }

      return {
        id: q.id, text: q.text, type: q.type, points: q.points,
        options: q.options, submittedAnswer: submitted?.answer ?? null, isCorrect,
      };
    });

    const score = graded.reduce((sum, q) => sum + (q.isCorrect ? q.points : 0), 0);
    const totalPoints = graded.reduce((sum, q) => sum + q.points, 0);

    res.json({ submission, graded, score, totalPoints, candidateEmail: submission.candidateEmail });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: err.message });
  }
};

module.exports = { submitExam, getMyResult, getCandidates, getSubmissionDetail };
