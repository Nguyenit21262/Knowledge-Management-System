import {Route, Routes, useLocation} from 'react-router-dom'
import Navbar from './components/Navbar'
import Home from './pages/Home'
import Footer from './components/Footer'
import {Toaster} from 'react-hot-toast' 
import DocumentDetail from './pages/DocumentDetail'
import Profile from './pages/Profile'

const App = () => {

  const isAdminRoute = useLocation().pathname.startsWith('/admin')

  return (
    <>
    <Toaster />

    {!isAdminRoute && <Navbar/>}
    <Routes>
      <Route path='/' element={<Home/>}/>
      <Route path='/documents/:documentId' element={<DocumentDetail/>}/>
      <Route path='/profile' element={<Profile/>}/>
    </Routes>
    {!isAdminRoute && <Footer/>}
    </>
  )
}

export default App
