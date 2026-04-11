const prisma = require("../lib/prisma");

const findAll = () =>
  prisma.onlineTest.findMany({
    orderBy: { createdAt: "desc" },
    include: {
      questions: true,
      timeSlots: true,
      user: { select: { email: true, role: true } },
    },
  });

const findById = (id) =>
  prisma.onlineTest.findUnique({
    where: { id },
    include: {
      questions: true,
      timeSlots: true,
      user: { select: { email: true, role: true } },
    },
  });

const create = ({ questions = [], timeSlots = [], ...testData }) =>
  prisma.onlineTest.create({
    data: {
      ...testData,
      questions: {
        create: questions.map(({ type, text, points, options, setNumber }) => ({
          type,
          text,
          points: points || 1,
          options: options ?? null,
          setNumber: setNumber || 1,
        })),
      },
      timeSlots: {
        create: timeSlots.map(({ startTime, endTime, maxCandidates }) => ({
          startTime: new Date(startTime),
          endTime: new Date(endTime),
          maxCandidates: Number(maxCandidates),
        })),
      },
    },
    include: { questions: true, timeSlots: true },
  });

const update = (id, data) =>
  prisma.onlineTest.update({ where: { id }, data });

const remove = (id) => prisma.onlineTest.delete({ where: { id } });

module.exports = { findAll, findById, create, update, remove };
