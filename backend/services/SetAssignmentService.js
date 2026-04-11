const prisma = require("../lib/prisma");

class SetAssignmentService {
  /**
   * Assigns a question set using round-robin (least-assigned set wins).
   * @param {number} testId
   * @param {number} totalSets
   * @returns {Promise<number>} assigned set number (1-based)
   */
  async assignSet(testId, totalSets) {
    if (totalSets <= 1) return 1;

    const setCounts = await prisma.examSession.groupBy({
      by: ["assignedSet"],
      where: { testId },
      _count: { assignedSet: true },
    });

    // Build a map with all sets defaulting to 0
    const countMap = new Map();
    for (let i = 1; i <= totalSets; i++) countMap.set(i, 0);
    setCounts.forEach((sc) => countMap.set(sc.assignedSet, sc._count.assignedSet));

    // Pick the set with the fewest assignments
    let minSet = 1;
    let minCount = countMap.get(1);
    for (let i = 2; i <= totalSets; i++) {
      if (countMap.get(i) < minCount) {
        minCount = countMap.get(i);
        minSet = i;
      }
    }

    return minSet;
  }
}

module.exports = new SetAssignmentService();
