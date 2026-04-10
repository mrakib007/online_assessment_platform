const prisma = require("../lib/prisma");

const findByEmail = (email) => prisma.user.findUnique({ where: { email } });

const findById = (id) => prisma.user.findUnique({ where: { id } });

module.exports = { findByEmail, findById };
