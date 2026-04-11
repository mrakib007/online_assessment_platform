class GradingService {
  /**
   * Grades an exam with optional negative marking.
   * @param {Array} questions - All questions for the test
   * @param {Array} answers - Candidate's submitted answers
   * @param {number} assignedSet - Candidate's assigned set number
   * @param {number} questionSetCount - Total number of sets
   * @param {boolean} negativeMarkingEnabled
   * @param {number} negativeMarkingPenalty - 0-100 percentage
   */
  gradeExam(questions, answers, assignedSet, questionSetCount, negativeMarkingEnabled, negativeMarkingPenalty) {
    const setQuestions =
      questionSetCount > 1
        ? questions.filter((q) => q.setNumber === assignedSet)
        : questions;

    let totalEarned = 0;
    let totalPenalty = 0;
    let totalPoints = 0;

    const graded = setQuestions.map((q) => {
      totalPoints += q.points;
      const submitted = answers.find((a) => a.questionId === q.id);
      const isCorrect = this.checkAnswer(q, submitted);

      let pointsEarned = 0;
      if (isCorrect === true) {
        pointsEarned = q.points;
        totalEarned += q.points;
      } else if (isCorrect === false && negativeMarkingEnabled) {
        pointsEarned = -(q.points * negativeMarkingPenalty) / 100;
        totalPenalty += Math.abs(pointsEarned);
      }
      // null = unanswered → 0 points, no penalty

      return {
        id: q.id,
        text: q.text,
        type: q.type,
        points: q.points,
        options: q.options,
        submittedAnswer: submitted?.answer ?? null,
        isCorrect,
        pointsEarned,
      };
    });

    const finalScore = Math.max(0, totalEarned - totalPenalty);
    const percentage = totalPoints > 0 ? (finalScore / totalPoints) * 100 : 0;

    return {
      graded,
      score: finalScore,
      totalPoints,
      penaltyPoints: totalPenalty,
      percentage: Math.round(percentage * 100) / 100,
    };
  }

  /**
   * @returns {boolean|null} true=correct, false=incorrect, null=unanswered
   */
  checkAnswer(question, submitted) {
    if (!submitted || submitted.answer === null || submitted.answer === undefined) {
      return null;
    }

    if (question.type === "MCQ" || question.type === "Radio" || question.type === "Checkbox") {
      const correctIndices = (question.options || [])
        .map((o, i) => (o.correct ? i : -1))
        .filter((i) => i !== -1);

      const submittedIndices = (
        Array.isArray(submitted.answer) ? submitted.answer : [submitted.answer]
      ).map(Number);

      return (
        correctIndices.length > 0 &&
        correctIndices.length === submittedIndices.length &&
        correctIndices.every((i) => submittedIndices.includes(i))
      );
    }

    if (question.type === "Text") {
      return typeof submitted.answer === "string" && submitted.answer.trim().length > 0;
    }

    return null;
  }
}

module.exports = new GradingService();
