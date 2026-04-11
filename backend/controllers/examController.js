const prisma = require("../lib/prisma");

// Submit exam — called when candidate finishes
const submitExam = async (req, res) => {
  try {
    const testId = Number(req.params.testId);
    const candidateId = req.user.id;
    const candidateEmail = req.user.email;

    // Upsert so re-submits don't create duplicates
    const submission = await prisma.examSubmission.upsert({
      where: { testId_candidateId: { testId, candidateId } },
      update: { submittedAt: new Date() },
      create: { testId, candidateId, candidateEmail, answers: [] },
    });

    res.status(201).json({ message: "Submitted", submission });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: err.message });
  }
};

// Get all candidates who took a specific test (for employer)
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

module.exports = { submitExam, getCandidates };
