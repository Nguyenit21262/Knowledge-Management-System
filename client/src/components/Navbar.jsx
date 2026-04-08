import React from 'react'
import { BookOpen, LogOut } from 'lucide-react'
import { Link } from 'react-router-dom'

const demoUser = {
  name: 'tranvannguyen24012003',
  role: 'Student',
}

const Navbar = ({ user = demoUser, onLogout }) => {
  const handleLogout = () => {
    if (onLogout) {
      onLogout()
    }
  }

  return (
    <header className="w-full border-b border-slate-200 bg-white">
      <div className="mx-auto flex max-w-screen-2xl items-center justify-between px-10 py-6">
        <Link to="/" className="flex items-center gap-4">
          <div className="flex h-15 w-15 items-center justify-center rounded-2xl ">
            <BookOpen className="h-7 w-7 text-black" strokeWidth={2.2} />
          </div>

          <div>
            <h1 className="text-[2rem] font-bold tracking-tight text-slate-950">
              Learning Hub
            </h1>
            <p className="text-[1.15rem] font-normal text-slate-600">
              Welcome, {user.name}
            </p>
          </div>
        </Link>

        <div className="flex items-center gap-4">
          <span className="inline-flex items-center rounded-full bg-[#e4e8ff] px-5 py-2 text-lg font-medium text-[#4338ff]">
            {user.role}
          </span>

          <button
            type="button"
            onClick={handleLogout}
            className="inline-flex items-center gap-3 rounded-2xl border border-slate-300 bg-white px-6 py-3.5 text-xl font-medium text-slate-950"
          >
            <LogOut className="h-5 w-5" strokeWidth={2.2} />
            Logout
          </button>
        </div>
      </div>
    </header>
  )
}

export default Navbar
