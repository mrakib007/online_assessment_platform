const onlineTestModel = require("../models/onlineTestModel");

const getAll = async (req, res) => {
  try {
    const tests = await onlineTestModel.findAll();
    res.json(tests);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const getOne = async (req, res) => {
  try {
    const test = await onlineTestModel.findById(Number(req.params.id));
    if (!test) return res.status(404).json({ message: "Test not found" });
    res.json(test);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const create = async (req, res) => {
  try {
    const {
      title,
      candidates,
      questionSet,
      questionType,
      negativeMarkingEnabled = false,
      negativeMarkingPenalty = 0,
      timeSlots = [],
      questions,
    } = req.body;

    if (!title) return res.status(400).json({ message: "Title is required" });

    const test = await onlineTestModel.create({
      title,
      candidates: candidates ? Number(candidates) : null,
      questionSet: questionSet ? Number(questionSet) : null,
      questionType: questionType || null,
      negativeMarkingEnabled: Boolean(negativeMarkingEnabled),
      negativeMarkingPenalty: Number(negativeMarkingPenalty) || 0,
      createdBy: req.user.id,
      questions: questions || [],
      timeSlots,
    });

    res.status(201).json(test);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: err.message });
  }
};

const update = async (req, res) => {
  try {
    const test = await onlineTestModel.update(Number(req.params.id), req.body);
    res.json(test);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const remove = async (req, res) => {
  try {
    await onlineTestModel.remove(Number(req.params.id));
    res.json({ message: "Deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = { getAll, getOne, create, update, remove };
