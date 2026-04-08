import React from 'react'
import { Bookmark } from 'lucide-react'

const SaveButton = () => {
  return (
    <button
      type="button"
      className="mt-5 inline-flex w-full items-center justify-center gap-3 rounded-full border border-slate-300 bg-white px-5 py-3 text-[1rem] font-normal text-slate-700"
    >
      <Bookmark className="h-5 w-5" strokeWidth={1.8} />
      Save
    </button>
  )
}

export default SaveButton
