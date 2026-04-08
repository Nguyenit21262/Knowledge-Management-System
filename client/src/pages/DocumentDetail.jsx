import React from 'react'
import { Link, useParams } from 'react-router-dom'
import DocumentComments from '../components/DocumentComments'
import DocumentOverview from '../components/DocumentOverview'
import { getDocumentById } from '../lib/mockDocuments'

const DocumentDetail = () => {
  const { documentId } = useParams()
  const document = getDocumentById(documentId)

  if (!document) {
    return (
      <main className="min-h-[calc(100vh-117px)] bg-[radial-gradient(circle_at_top,#ffffff_0%,#f8f9fc_45%,#f3f5fb_100%)] px-10 py-12">
        <div className="mx-auto max-w-screen-2xl rounded-[28px] border border-slate-200 bg-white px-12 py-14 text-center shadow-[0_6px_20px_rgba(15,23,42,0.06)]">
          <h1 className="mb-4 text-[2rem] font-semibold tracking-tight text-slate-950">
            Document not found
          </h1>
          <p className="mb-8 text-[1.1rem] text-slate-600">
            The document you are looking for is not available in the mock data yet.
          </p>
          <Link
            to="/"
            className="inline-flex rounded-2xl bg-[linear-gradient(135deg,#5a46ff_0%,#4b35e8_100%)] px-6 py-3 text-[1rem] font-medium text-white"
          >
            Back to documents
          </Link>
        </div>
      </main>
    )
  }

  return (
    <main className="min-h-[calc(100vh-117px)] bg-[radial-gradient(circle_at_top,#ffffff_0%,#f8f9fc_45%,#f3f5fb_100%)] px-10 py-12">
      <div className="mx-auto max-w-screen-2xl space-y-8">
        <DocumentOverview document={document} />
        <DocumentComments document={document} />
      </div>
    </main>
  )
}

export default DocumentDetail
