import {Route, Routes, useLocation} from 'react-router-dom'
import Navbar from './components/Navbar'
import Home from './pages/Home'
import Footer from './components/Footer'
import {Toaster} from 'react-hot-toast' 

const App = () => {

  const isAdminRoute = useLocation().pathname.startsWith('/admin')

  return (
    <>
    <Toaster />

    {!isAdminRoute && <Navbar/>}
    <Routes>
      <Route path='/' element={<Home/>}/>
    </Routes>
    {!isAdminRoute && <Footer/>}
    </>
  )
}

export default App
