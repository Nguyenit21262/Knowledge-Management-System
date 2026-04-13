import path from "path";
import Category from "../models/Category.js";
import Comment from "../models/Comment.js";
import Material from "../models/Material.js";
import Subject from "../models/Subject.js";
import {
  detectFileType,
  deleteUploadedFile,
  uploadDir,
} from "../utils/fileHelpers.js";
import { formatMaterial } from "../utils/materialFormatter.js";
import { extractPdfText } from "../utils/pdfHelpers.js";
import { normalizeWhitespace } from "../utils/normalizeText.js";
import {
  buildContainsInsensitiveRegex,
  buildExactInsensitiveRegex,
} from "../utils/regexUtils.js";
import { normalizeUserRole } from "../models/User.js";

const buildMaterialFilter = ({ search, subject, type, category, uploadedBy, letter }) => {
  const filter = {};
  const normalizedSearch = normalizeWhitespace(search);
  const normalizedSubject = normalizeWhitespace(subject);
  const normalizedCategory = normalizeWhitespace(category);
  const normalizedType = normalizeWhitespace(type);
  const normalizedLetter = typeof letter === "string" ? letter.trim().toUpperCase() : "";

  if (uploadedBy) {
    filter.uploadedBy = uploadedBy;
  }

  if (normalizedSearch) {
    const searchRegex = buildContainsInsensitiveRegex(normalizedSearch);

    filter.$or = [
      { title: searchRegex },
      { description: searchRegex },
      { subject: searchRegex },
      { category: searchRegex },
      { contentText: searchRegex },
    ];
  }

  if (normalizedSubject) {
    filter.subject = buildExactInsensitiveRegex(normalizedSubject);
  }

  if (normalizedCategory) {
    filter.category = buildExactInsensitiveRegex(normalizedCategory);
  }

  if (normalizedType) {
    filter.type = normalizedType.toUpperCase();
  }

  // Filter by first letter of title (case-insensitive)
  if (normalizedLetter && /^[A-Z]$/.test(normalizedLetter)) {
    filter.title = {
      ...(filter.title || {}),
      $regex: new RegExp(`^${normalizedLetter}`, "i"),
    };
  }

  return filter;
};

const buildSortOption = ({ sortBy, sortOrder }) => {
  const validSortFields = ["title", "createdAt", "views", "downloads"];
  const field = validSortFields.includes(sortBy) ? sortBy : "createdAt";
  const order = sortOrder === "asc" ? 1 : -1;
  return { [field]: order };
};

const normalizeMaterialPayload = (body = {}) => ({
  title: normalizeWhitespace(typeof body.title === "string" ? body.title : ""),
  description: normalizeWhitespace(
    typeof body.description === "string" ? body.description : "",
  ),
  subject: normalizeWhitespace(
    typeof body.subject === "string" ? body.subject : "",
  ),
  category: normalizeWhitespace(
    typeof body.category === "string" ? body.category : "",
  ),
});

const buildSuggestionsFromMaterials = (materials, query) => {
  const normalizedQuery = normalizeWhitespace(query).toLowerCase();
  const uniqueSuggestions = new Set();

  for (const material of materials) {
    const candidateValues = [material.subject, material.title];

    for (const value of candidateValues) {
      if (!value) {
        continue;
      }

      const nextSuggestion = String(value).trim();

      if (
        !nextSuggestion ||
        !nextSuggestion.toLowerCase().includes(normalizedQuery)
      ) {
        continue;
      }

      uniqueSuggestions.add(nextSuggestion);

      if (uniqueSuggestions.size >= 10) {
        return Array.from(uniqueSuggestions);
      }
    }
  }

  return Array.from(uniqueSuggestions);
};

const resolveMaterialTaxonomy = async ({ subject, category }) => {
  let [subjectDoc, categoryDoc] = await Promise.all([
    subject
      ? Subject.findOne({ name: buildExactInsensitiveRegex(subject) })
      : null,
    category
      ? Category.findOne({ name: buildExactInsensitiveRegex(category) })
      : null,
  ]);

  if (subject && !subjectDoc) {
    subjectDoc = await Subject.create({ name: subject });
  }

  if (category && !categoryDoc) {
    categoryDoc = await Category.create({ name: category });
  }

  return {
    subject: subjectDoc?.name,
    category: categoryDoc?.name,
  };
};

const getValidatedTaxonomy = async (body) => {
  const normalized = normalizeMaterialPayload(body);

  if (!normalized.title || !normalized.subject || !normalized.category) {
    return {
      error: "Title, subject, and category are required.",
    };
  }

  const taxonomy = await resolveMaterialTaxonomy(normalized);

  if (taxonomy.error) {
    return { error: taxonomy.error };
  }

  return {
    data: {
      ...normalized,
      subject: taxonomy.subject,
      category: taxonomy.category,
    },
  };
};

const getCurrentUserId = (req) =>
  req.user?._id?.toString?.() || req.user?.id?.toString?.() || req.userId?.toString?.() || "";

const canManageMaterial = (req, material) => {
  const currentUserId = getCurrentUserId(req);
  const uploadedById = material?.uploadedBy?.toString?.() || "";
  const currentUserRole = normalizeUserRole(req.user?.role);

  return currentUserRole === "teacher" || currentUserId === uploadedById;
};

export const getMaterials = async (req, res) => {
  try {
    const sortOption = buildSortOption({
      sortBy: req.query.sortBy,
      sortOrder: req.query.sortOrder,
    });

    const materials = await Material.find(buildMaterialFilter(req.query))
      .populate("uploadedBy", "name role")
      .sort(sortOption)
      .lean();

    return res.json(materials.map((material) => formatMaterial(material)));
  } catch (err) {
    return res.status(500).json({
      message: "Server error while fetching materials.",
      error: err.message,
    });
  }
};

export const searchMaterials = async (req, res) => {
  try {
    const query = normalizeWhitespace(req.query?.q || "");
    const letter = typeof req.query?.letter === "string" ? req.query.letter.trim().toUpperCase() : "";
    const sortBy = req.query?.sortBy || "createdAt";
    const sortOrder = req.query?.sortOrder || "desc";
    const subject = normalizeWhitespace(req.query?.subject || "");

    // Build a combined filter for search + letter + subject
    const filter = {};

    if (query) {
      const searchRegex = buildContainsInsensitiveRegex(query);
      filter.$or = [
        { title: searchRegex },
        { description: searchRegex },
        { subject: searchRegex },
        { category: searchRegex },
        { contentText: searchRegex },
      ];
    }

    if (letter && /^[A-Z]$/.test(letter)) {
      filter.title = { $regex: new RegExp(`^${letter}`, "i") };
    }

    if (subject) {
      filter.subject = buildExactInsensitiveRegex(subject);
    }

    const sortOption = buildSortOption({ sortBy, sortOrder });

    const materials = await Material.find(filter)
      .populate("uploadedBy", "name role")
      .sort(sortOption)
      .lean();

    return res.status(200).json({
      success: true,
      total: materials.length,
      materials: materials.map((material) => formatMaterial(material)),
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: "Failed to search materials.",
      error: err.message,
    });
  }
};

export const getLetterCounts = async (req, res) => {
  try {
    const alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");

    // Use MongoDB aggregation to count documents per first letter
    const pipeline = [
      {
        $project: {
          firstLetter: { $toUpper: { $substrCP: ["$title", 0, 1] } },
        },
      },
      {
        $group: {
          _id: "$firstLetter",
          count: { $sum: 1 },
        },
      },
    ];

    const results = await Material.aggregate(pipeline);

    // Build a counts object with all 26 letters
    const counts = {};
    alphabet.forEach((l) => (counts[l] = 0));
    results.forEach((r) => {
      if (counts[r._id] !== undefined) {
        counts[r._id] = r.count;
      }
    });

    return res.json({
      success: true,
      counts,
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: "Failed to fetch letter counts.",
      error: err.message,
    });
  }
};

export const searchMaterialSuggestions = async (req, res) => {
  try {
    const query = normalizeWhitespace(req.query?.q || "");

    if (!query) {
      return res.json({ suggestions: [] });
    }

    const searchRegex = buildContainsInsensitiveRegex(query);
    const materials = await Material.find({
      $or: [
        { subject: searchRegex },
        { title: searchRegex },
        { category: searchRegex },
      ],
    })
      .select("subject title category")
      .sort({ createdAt: -1 })
      .limit(20)
      .lean();

    const suggestions = buildSuggestionsFromMaterials(materials, query);

    return res.json({ suggestions });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: "Failed to fetch suggestions.",
      error: err.message,
    });
  }
};

export const getMaterialById = async (req, res) => {
  try {
    const material = await Material.findByIdAndUpdate(
      req.params.id,
      { $inc: { views: 1 } },
      { returnDocument: "after" },
    )
      .populate("uploadedBy", "name role")
      .lean();

    if (!material) {
      return res.status(404).json({
        message: "Material not found.",
      });
    }

    const comments = await Comment.find({ material: req.params.id })
      .populate("author", "name role")
      .sort({ createdAt: 1 })
      .lean();

    return res.json(formatMaterial(material, comments));
  } catch (err) {
    return res.status(500).json({
      message: "Server error while fetching material details.",
      error: err.message,
    });
  }
};

export const createMaterial = async (req, res) => {
  try {
    const validation = await getValidatedTaxonomy(req.body);

    if (validation.error) {
      return res.status(400).json({
        message: validation.error,
      });
    }

    if (!req.file) {
      return res.status(400).json({
        message: "Please choose a file to upload.",
      });
    }

    const detectedType = detectFileType(req.file.originalname);
    let contentText = "";

    if (detectedType === "PDF") {
      const filePath = path.join(uploadDir, req.file.filename);
      contentText = await extractPdfText(filePath);
    }

    const material = await Material.create({
      ...validation.data,
      type: detectedType,
      fileUrl: `/uploads/${req.file.filename}`,
      contentText,
      uploadedBy: req.user?._id || req.user?.id,
    });

    await material.populate("uploadedBy", "name role");

    return res.status(201).json({
      message: "Material uploaded successfully.",
      material: formatMaterial(material),
    });
  } catch (err) {
    return res.status(500).json({
      message: "Server error while creating material.",
      error: err.message,
    });
  }
};

export const updateMaterial = async (req, res) => {
  try {
    const material = await Material.findById(req.params.id);

    if (!material) {
      return res.status(404).json({
        message: "Material not found.",
      });
    }

    if (!canManageMaterial(req, material)) {
      return res.status(403).json({
        message: "You do not have permission to update this material.",
      });
    }

    const titleProvided = Object.prototype.hasOwnProperty.call(
      req.body || {},
      "title",
    );
    const descriptionProvided = Object.prototype.hasOwnProperty.call(
      req.body || {},
      "description",
    );
    const subjectProvided = Object.prototype.hasOwnProperty.call(
      req.body || {},
      "subject",
    );
    const categoryProvided = Object.prototype.hasOwnProperty.call(
      req.body || {},
      "category",
    );

    if (titleProvided) {
      const normalizedTitle = normalizeWhitespace(
        typeof req.body.title === "string" ? req.body.title : "",
      );

      if (!normalizedTitle) {
        return res.status(400).json({
          message: "Title cannot be empty.",
        });
      }

      material.title = normalizedTitle;
    }

    if (descriptionProvided) {
      material.description = normalizeWhitespace(
        typeof req.body.description === "string" ? req.body.description : "",
      );
    }

    if (subjectProvided || categoryProvided) {
      const nextSubject = subjectProvided
        ? normalizeWhitespace(
            typeof req.body.subject === "string" ? req.body.subject : "",
          )
        : material.subject;
      const nextCategory = categoryProvided
        ? normalizeWhitespace(
            typeof req.body.category === "string" ? req.body.category : "",
          )
        : material.category;

      if (subjectProvided && !nextSubject) {
        return res.status(400).json({
          message: "Subject cannot be empty.",
        });
      }

      if (categoryProvided && !nextCategory) {
        return res.status(400).json({
          message: "Category cannot be empty.",
        });
      }

      const taxonomy = await resolveMaterialTaxonomy({
        subject: nextSubject,
        category: nextCategory,
      });

      if (taxonomy.error) {
        return res.status(400).json({
          message: taxonomy.error,
        });
      }

      if (subjectProvided) {
        material.subject = taxonomy.subject;
      }

      if (categoryProvided) {
        material.category = taxonomy.category;
      }
    }

    await material.save();
    await material.populate("uploadedBy", "name role");

    return res.json({
      message: "Material updated successfully.",
      material: formatMaterial(material),
    });
  } catch (err) {
    return res.status(500).json({
      message: "Server error while updating material.",
      error: err.message,
    });
  }
};

export const incrementDownload = async (req, res) => {
  try {
    const material = await Material.findByIdAndUpdate(
      req.params.id,
      { $inc: { downloads: 1 } },
      { returnDocument: "after" },
    );

    if (!material) {
      return res.status(404).json({
        message: "Material not found.",
      });
    }

    return res.json({
      message: "Download count updated successfully.",
      downloads: material.downloads,
    });
  } catch (err) {
    return res.status(500).json({
      message: "Server error while updating download count.",
      error: err.message,
    });
  }
};

export const deleteMaterial = async (req, res) => {
  try {
    const material = await Material.findById(req.params.id);

    if (!material) {
      return res.status(404).json({
        message: "Material not found.",
      });
    }

    if (!canManageMaterial(req, material)) {
      return res.status(403).json({
        message: "You do not have permission to delete this material.",
      });
    }

    deleteUploadedFile(material.fileUrl);

    // Delete comments one-by-one so Mongoose post hooks fire
    // (deleteMany does NOT trigger document-level post hooks).
    const relatedComments = await Comment.find({ material: req.params.id }).select("_id");
    await Promise.all(
      relatedComments.map((c) => Comment.findByIdAndDelete(c._id)),
    );

    await Material.findByIdAndDelete(req.params.id);

    return res.json({
      message: "Material and related comments deleted successfully.",
    });
  } catch (err) {
    return res.status(500).json({
      message: "Server error while deleting material.",
      error: err.message,
    });
  }
};

export const downloadMaterialFile = async (req, res) => {
  try {
    const material = await Material.findById(req.params.id);

    if (!material || !material.fileUrl) {
      return res.status(404).json({ message: "File not found." });
    }

    const filename = material.fileUrl.split("/").pop();
    const filePath = path.join(uploadDir, filename);

    // Provide Content-Disposition to force the browser to strictly Download
    return res.download(filePath, `${material.title.replace(/[^a-zA-Z0-9-_\.]/g, '_')}${path.extname(filename)}`);
  } catch (err) {
    return res.status(500).json({
      message: "Server error during file download.",
      error: err.message,
    });
  }
};
