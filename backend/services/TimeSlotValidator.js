const prisma = require("../lib/prisma");

class TimeSlotValidator {
  /**
   * Validates if current time falls within an available, non-full time slot.
   * @param {Array} timeSlots
   * @param {number} testId
   * @returns {Promise<Object>} validation result
   */
  async validateTimeSlot(timeSlots, testId) {
    if (!timeSlots || timeSlots.length === 0) {
      return { valid: true }; // no slots defined = no restriction
    }

    const now = new Date();

    for (const slot of timeSlots) {
      const start = new Date(slot.startTime);
      const end = new Date(slot.endTime);

      if (now >= start && now <= end) {
        const count = await prisma.examSession.count({
          where: {
            testId,
            startedAt: { gte: start, lte: end },
          },
        });

        if (count < slot.maxCandidates) {
          return {
            valid: true,
            slot: {
              startTime: slot.startTime,
              endTime: slot.endTime,
              remainingTime: Math.floor((end - now) / 60000),
            },
          };
        }

        return {
          valid: false,
          reason: "SLOT_FULL",
          message: "This time slot has reached maximum capacity",
        };
      }
    }

    // Find next upcoming slot
    const futureSlots = timeSlots
      .filter((s) => new Date(s.startTime) > now)
      .sort((a, b) => new Date(a.startTime) - new Date(b.startTime));

    if (futureSlots.length > 0) {
      return {
        valid: false,
        reason: "OUTSIDE_SLOT",
        message: "Current time is outside available time slots",
        nextSlot: {
          startTime: futureSlots[0].startTime,
          endTime: futureSlots[0].endTime,
        },
      };
    }

    return {
      valid: false,
      reason: "NO_SLOTS",
      message: "No available time slots for this exam",
    };
  }
}

module.exports = new TimeSlotValidator();
