import Blog from './pages/Blog'
import Signup from './pages/Signup'
import Singin from './pages/Signin'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import './App.css'

function App() {

  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path='/signup' element={<Signup />} />
          <Route path='/signin' element={<Singin />} />
          <Route path='/blog/:id' element={<Blog />} />
        </Routes>
      </BrowserRouter>
    </>
  )
}

export default App
