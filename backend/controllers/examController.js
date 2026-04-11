const prisma = require("../lib/prisma");

// Submit exam answers
const submitExam = async (req, res) => {
  try {
    const testId = Number(req.params.testId);
    const { answers } = req.body; // [{ questionId, answer }]
    const candidateId = req.user.id;

    const test = await prisma.onlineTest.findUnique({
      where: { id: testId },
      include: { questions: true },
    });

    if (!test) return res.status(404).json({ message: "Test not found" });

    // Calculate score
    let score = 0;
    let totalPoints = 0;

    for (const question of test.questions) {
      totalPoints += question.points;
      const submitted = answers?.find((a) => a.questionId === question.id);
      if (!submitted) continue;

      if (question.type === "MCQ" || question.type === "Radio") {
        const options = question.options || [];
        const correctIndices = options
          .map((o, i) => (o.correct ? i : -1))
          .filter((i) => i !== -1);

        const submittedIndices = (Array.isArray(submitted.answer)
          ? submitted.answer
          : [submitted.answer]
        ).map(Number);

        const isCorrect =
          correctIndices.length === submittedIndices.length &&
          correctIndices.every((i) => submittedIndices.includes(i));

        if (isCorrect) score += question.points;
      }
      // Text answers are not auto-graded
    }

    // Save submission
    const submission = await prisma.examSubmission.create({
      data: {
        testId,
        candidateId,
        answers: answers || [],
        score,
        totalPoints,
      },
    });

    res.status(201).json({ message: "Exam submitted successfully", score, totalPoints, submission });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: err.message });
  }
};

// Get submission for a candidate
const getSubmission = async (req, res) => {
  try {
    const testId = Number(req.params.testId);
    const candidateId = req.user.id;

    const submission = await prisma.examSubmission.findFirst({
      where: { testId, candidateId },
    });

    res.json(submission || null);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = { submitExam, getSubmission };
