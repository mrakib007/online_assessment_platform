const prisma = require("../lib/prisma");

const findAll = () =>
  prisma.onlineTest.findMany({
    orderBy: { createdAt: "desc" },
    include: { user: { select: { email: true, role: true } } },
  });

const findById = (id) =>
  prisma.onlineTest.findUnique({
    where: { id },
    include: { user: { select: { email: true, role: true } } },
  });

const create = (data) => prisma.onlineTest.create({ data });

const update = (id, data) =>
  prisma.onlineTest.update({ where: { id }, data });

const remove = (id) => prisma.onlineTest.delete({ where: { id } });

module.exports = { findAll, findById, create, update, remove };
