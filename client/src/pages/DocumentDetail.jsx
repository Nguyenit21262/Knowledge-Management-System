import React, { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import DocumentComments from '../components/DocumentComments'
import DocumentOverview from '../components/DocumentOverview'
import { getMaterialById } from '../api/materials.js'
import { formatDate } from '../utils/formatters.js'
import toast from 'react-hot-toast'

const DocumentDetail = () => {
  const { documentId } = useParams()
  const [document, setDocument] = useState(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchDocument = async () => {
      try {
        const data = await getMaterialById(documentId);
        setDocument({
          ...data,
          date: formatDate(data.date),
        });
      } catch (error) {
        toast.error("Failed to load document details.");
      } finally {
        setIsLoading(false);
      }
    };
    fetchDocument();
  }, [documentId])

  if (isLoading) {
    return (
      <main className="min-h-[calc(100vh-117px)] bg-[#f6f9ff] px-10 py-12 flex items-center justify-center">
        <div className="text-xl text-slate-500">Loading document...</div>
      </main>
    )
  }

  if (!document) {
    return (
      <main className="min-h-[calc(100vh-117px)] bg-[#f6f9ff] px-10 py-12">
        <div className="mx-auto max-w-screen-2xl rounded-[28px] border border-slate-200 bg-white px-12 py-14 text-center shadow-[0_6px_20px_rgba(15,23,42,0.06)]">
          <h1 className="mb-4 text-[2rem] font-medium tracking-tight text-slate-950">
            Document not found
          </h1>
          <p className="mb-8 text-[1.1rem] text-slate-600">
            The document you are looking for is not available or has been deleted.
          </p>
          <Link
            to="/"
            className="inline-flex rounded-2xl bg-[var(--theme-blue)] px-6 py-3 text-[1rem] font-normal text-white"
          >
            Back to documents
          </Link>
        </div>
      </main>
    )
  }

  return (
    <main className="min-h-[calc(100vh-117px)] bg-[#f6f9ff] px-10 py-12">
      <div className="mx-auto max-w-screen-2xl space-y-8">
        <DocumentOverview document={document} setDocument={setDocument} />
        {/* <FileViewer document={document} /> */}
        <DocumentComments document={document} />
      </div>
    </main>
  )
}

export default DocumentDetail
