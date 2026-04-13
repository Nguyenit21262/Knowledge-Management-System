import Category from "../models/Category.js";
import { normalizeWhitespace } from "../utils/normalizeText.js";
import { buildExactInsensitiveRegex } from "../utils/regexUtils.js";

export const getCategories = async (req, res) => {
  try {
    const categories = await Category.find().sort({ name: 1 }).lean();
    return res.json(categories);
  } catch (err) {
    return res.status(500).json({
      message: "Server error while fetching categories.",
      error: err.message,
    });
  }
};

export const createCategory = async (req, res) => {
  try {
    const name = normalizeWhitespace(
      typeof req.body?.name === "string" ? req.body.name : "",
    );

    if (!name) {
      return res.status(400).json({
        message: "Category name cannot be empty.",
      });
    }

    const existing = await Category.findOne({
      name: buildExactInsensitiveRegex(name),
    }).lean();

    if (existing) {
      return res.status(400).json({
        message: "Category already exists.",
      });
    }

    const category = await Category.create({ name });

    return res.status(201).json({
      message: "Category created successfully.",
      category,
    });
  } catch (err) {
    if (err.code === 11000) {
      return res.status(400).json({
        message: "Category already exists.",
      });
    }

    return res.status(500).json({
      message: "Server error while creating category.",
      error: err.message,
    });
  }
};
