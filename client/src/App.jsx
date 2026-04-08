import {Route, Routes, useLocation} from 'react-router-dom'
import Navbar from './components/Navbar'
import Home from './pages/Home'
import Footer from './components/Footer'
import {Toaster} from 'react-hot-toast' 
import DocumentDetail from './pages/DocumentDetail'
import Profile from './pages/Profile'
import Sidebar from './components/Sidebar'
import Uploads from './pages/Uploads'

const App = () => {

  const isAdminRoute = useLocation().pathname.startsWith('/admin')

  return (
    <>
    <Toaster />

    {!isAdminRoute ? (
      <>
        <Navbar/>
        <div className='flex gap-6 px-0 pb-6'>
          <Sidebar />
          <div className='min-w-0 flex-1'>
            <Routes>
              <Route path='/' element={<Home/>}/>
              <Route path='/documents/:documentId' element={<DocumentDetail/>}/>
              <Route path='/profile' element={<Profile/>}/>
              <Route path='/uploads' element={<Uploads/>}/>
            </Routes>
            <Footer/>
          </div>
        </div>
      </>
    ) : (
      <Routes>
        <Route path='/' element={<Home/>}/>
        <Route path='/documents/:documentId' element={<DocumentDetail/>}/>
        <Route path='/profile' element={<Profile/>}/>
        <Route path='/uploads' element={<Uploads/>}/>
      </Routes>
    )}
    </>
  )
}

export default App
