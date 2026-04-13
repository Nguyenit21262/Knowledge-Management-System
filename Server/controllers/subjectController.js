import Subject from "../models/Subject.js";
import { normalizeWhitespace } from "../utils/normalizeText.js";
import { buildExactInsensitiveRegex } from "../utils/regexUtils.js";

export const getSubjects = async (req, res) => {
  try {
    const subjects = await Subject.find().sort({ name: 1 }).lean();
    return res.json(subjects);
  } catch (err) {
    return res.status(500).json({
      message: "Server error while fetching subjects.",
      error: err.message,
    });
  }
};

export const createSubject = async (req, res) => {
  try {
    const name = normalizeWhitespace(
      typeof req.body?.name === "string" ? req.body.name : "",
    );

    if (!name) {
      return res.status(400).json({
        message: "Subject name cannot be empty.",
      });
    }

    const existing = await Subject.findOne({
      name: buildExactInsensitiveRegex(name),
    }).lean();

    if (existing) {
      return res.status(400).json({
        message: "Subject already exists.",
      });
    }

    const subject = await Subject.create({ name });

    return res.status(201).json({
      message: "Subject created successfully.",
      subject,
    });
  } catch (err) {
    if (err.code === 11000) {
      return res.status(400).json({
        message: "Subject already exists.",
      });
    }

    return res.status(500).json({
      message: "Server error while creating subject.",
      error: err.message,
    });
  }
};
