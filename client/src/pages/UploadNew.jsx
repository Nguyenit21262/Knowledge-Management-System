import React, { useRef, useState } from "react";
import { ChevronDown, Upload } from "lucide-react";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { uploadMaterial } from "../api/materials.js";
import useTaxonomy from "../hooks/useTaxonomy.js";

const UploadNew = () => {
  const navigate = useNavigate();
  const fileInputRef = useRef(null);
  const [formData, setFormData] = useState({
    title: "",
    subject: "",
    category: "",
    description: "",
  });
  const [selectedFileObj, setSelectedFileObj] = useState(null);
  const [selectedFileName, setSelectedFileName] = useState("");
  const [isUploading, setIsUploading] = useState(false);

  const { subjects: subjectOptions, categories: categoryOptions } = useTaxonomy();

  const handleChange = (event) => {
    const { name, value } = event.target;

    setFormData((current) => ({
      ...current,
      [name]: value,
    }));
  };

  const handleFileChange = (event) => {
    const file = event.target.files?.[0];
    if (file) {
      setSelectedFileObj(file);
      setSelectedFileName(file.name);
    } else {
      setSelectedFileObj(null);
      setSelectedFileName("");
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!selectedFileObj) {
      return toast.error("Please select a file to upload.");
    }
    if (!formData.category.trim()) {
      return toast.error("Please enter a category.");
    }

    setIsUploading(true);

    try {
      const payload = new FormData();
      payload.append("title", formData.title);
      payload.append("subject", formData.subject);
      payload.append("category", formData.category);
      payload.append("description", formData.description);
      payload.append("file", selectedFileObj);

      await uploadMaterial(payload);
      toast.success("Document uploaded successfully.");
      navigate("/uploads");
    } catch (error) {
      toast.error(error.message || "Failed to upload document.");
    } finally {
      setIsUploading(false);
    }
  };

  const isFormValid = Boolean(
    formData.title.trim() &&
    formData.subject &&
    formData.category &&
    selectedFileObj
  );

  return (
    <main className="min-h-[calc(100vh-117px)]  px-10 py-16">
      <div className="mx-auto max-w-[1200px] rounded-[28px] border border-slate-200 bg-white px-10 py-12 shadow-[0_6px_20px_rgba(15,23,42,0.04)]">
        <div className="mb-12">
          <div className="mb-3 flex items-center gap-3 text-slate-950">
            <Upload className="h-7 w-7 text-[#3b82f6]" strokeWidth={1.8} />
            <h1 className="text-[3rem] font-medium tracking-tight">
              Upload Document
            </h1>
          </div>

          <p className="text-[1.15rem] font-normal text-slate-500">
            Share learning materials with the community
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-10">
          <div>
            <label
              htmlFor="title"
              className="mb-4 block text-[1.2rem] font-medium text-slate-950"
            >
              Title <span className="text-red-500">*</span>
            </label>
            <input
              id="title"
              name="title"
              type="text"
              value={formData.title}
              onChange={handleChange}
              placeholder="Enter document title..."
              className="w-full rounded-2xl border border-slate-200 bg-white px-6 py-5 text-[1.1rem] font-normal text-slate-700 outline-none placeholder:text-slate-400"
            />
          </div>

          <div>
            <label
              htmlFor="subject"
              className="mb-4 block text-[1.2rem] font-medium text-slate-950"
            >
              Subject <span className="text-red-500">*</span>
            </label>

            <div className="relative">
              <input
                id="subject"
                name="subject"
                list="subject-list"
                value={formData.subject}
                onChange={handleChange}
                placeholder="Select or type a new subject"
                className="w-full appearance-none rounded-2xl border border-slate-200 bg-white px-6 py-5 pr-14 text-[1.1rem] font-normal text-slate-700 outline-none placeholder:text-slate-400"
              />
              <datalist id="subject-list">
                {subjectOptions.map((subject) => (
                  <option key={subject} value={subject} />
                ))}
              </datalist>

              <ChevronDown
                className="pointer-events-none absolute right-5 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-500"
                strokeWidth={1.8}
              />
            </div>
          </div>

          <div>
            <label
              htmlFor="category"
              className="mb-4 block text-[1.2rem] font-medium text-slate-950"
            >
              Category <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <input
                id="category"
                name="category"
                list="category-list"
                value={formData.category}
                onChange={handleChange}
                placeholder="Select or type a new category"
                className="w-full appearance-none rounded-2xl border border-slate-200 bg-white px-6 py-5 pr-14 text-[1.1rem] font-normal text-slate-700 outline-none placeholder:text-slate-400"
              />
              <datalist id="category-list">
                {categoryOptions.map((category) => (
                  <option key={category} value={category} />
                ))}
              </datalist>

              <ChevronDown
                className="pointer-events-none absolute right-5 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-500"
                strokeWidth={1.8}
              />
            </div>
          </div>

          <div>
            <label
              htmlFor="description"
              className="mb-4 block text-[1.2rem] font-medium text-slate-950"
            >
              Description
            </label>
            <textarea
              id="description"
              name="description"
              rows="5"
              value={formData.description}
              onChange={handleChange}
              placeholder="Write a short description of the document..."
              className="w-full resize-none rounded-2xl border border-slate-200 bg-white px-6 py-5 text-[1.1rem] font-normal text-slate-700 outline-none placeholder:text-slate-400"
            />
          </div>

          <div>
            <p className="mb-4 block text-[1.2rem] font-medium text-slate-950">
              Attachment <span className="text-red-500">*</span>
            </p>

            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="flex w-full flex-col items-center justify-center rounded-[24px] border border-dashed border-slate-300 bg-white px-8 py-20 text-center"
            >
              <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-slate-50 text-slate-500 shadow-[0_4px_12px_rgba(15,23,42,0.05)]">
                <Upload className="h-8 w-8" strokeWidth={1.8} />
              </div>

              <p className="text-[1.28rem] font-medium text-slate-900">
                Drag and drop or click to choose a file
              </p>
              <p className="mt-2 text-[1.05rem] font-normal text-slate-500">
                PDF, DOCX, PPTX, images (up to 20MB)
              </p>

              {selectedFileName && (
                <p className="mt-4 text-[1rem] font-normal text-[var(--theme-blue)]">
                  Selected file: {selectedFileName}
                </p>
              )}
            </button>

            <input
              ref={fileInputRef}
              type="file"
              accept=".pdf,.doc,.docx,.ppt,.pptx,image/*"
              onChange={handleFileChange}
              className="hidden"
            />
          </div>

          <button
            type="submit"
            disabled={isUploading || !isFormValid}
            className="flex w-full items-center justify-center gap-3 rounded-2xl bg-[var(--theme-blue)] px-6 py-5 text-[1.15rem] font-medium text-white disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Upload className="h-5 w-5" strokeWidth={1.8} />
            {isUploading ? "Uploading..." : "Upload Document"}
          </button>
        </form>
      </div>
    </main>
  );
};

export default UploadNew;
