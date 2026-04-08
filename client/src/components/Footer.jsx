import React from 'react'

const Footer = () => {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="w-full border-t border-slate-200 bg-white">
      <div className="mx-auto flex max-w-screen-2xl items-center justify-between px-10 py-4 text-sm text-slate-500">
        <p>Copyright {currentYear} Learning Hub</p>
        <p>Knowledge Management System</p>
      </div>
    </footer>
  )
}

export default Footer
