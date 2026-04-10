import fs from "fs";
import { CanvasFactory } from "pdf-parse/worker";
import { PDFParse } from "pdf-parse";

export const extractPdfText = async (filePath) => {
  try {
    const buffer = fs.readFileSync(filePath);

    const parser = new PDFParse({
      data: buffer,
      CanvasFactory,
    });

    const result = await parser.getText();
    return result?.text ? result.text.trim() : "";
  } catch (error) {
    console.error("PDF parse error:", error.message);
    return "";
  }
};
