import './App.css'
import NavBar from './components/NavBar/NavBar'
import SignUp from './components/SignUp/SignUp'
import SignIn from './components/SignIn/SignIn'
import ProgramForm from './components/ProgramForm/ProgramForm.jsx'
import { Route, Routes } from 'react-router-dom'
import * as authService from './services/authService.js'
import * as programService from './services/programService.js'

import { useState } from 'react'


const App = () => {

  const initialState = authService.getUser()

  const [user, setUser] = useState(initialState)
  const [programs, setPrograms] = useState([])

  const handleSignUp = async (formData) => {
    try {
      const res = await authService.signUp(formData)
      setUser(res)
      return { success: true }
      
    } catch(err){
      return { success: false, message: err.message }
    }
  }

  const handleSignOut = () => {
    localStorage.removeItem('token')
    setUser(null)
  }

  const handleSignIn = async (formData) => {
    const res = await authService.signIn(formData)
    setUser(res)
  }

  const handleAddProgram = async(formData)=>{
    const newProgram = await programService.create(formData)
    setPrograms([...programs,newProgram])
  }
  
  return (
    <>
      <NavBar user={user} handleSignOut={handleSignOut} />
      <Routes>
          <Route path='/' element={<h1>Hello world!</h1>} />
          <Route path='/sign-up' element={<SignUp handleSignUp={handleSignUp} user={user} />} />
          <Route path='/sign-in' element={<SignIn handleSignIn={handleSignIn} user={user} />} />
          <Route path='*' element={<h1>404</h1>} />

          <Route path='/api/programs/new' element={<ProgramForm handleAddProgram={handleAddProgram}/>}/>
    </Routes>
    </>
  )
}

export default App


