import './App.css'
import NavBar from './components/NavBar/NavBar'
import SignUp from './components/SignUp/SignUp'
import SignIn from './components/SignIn/SignIn'
import ProgramForm from './components/ProgramForm/ProgramForm.jsx'
import ProgramList from './components/ProgramList/ProgramList.jsx'
import { Route, Routes, useNavigate } from 'react-router-dom'
import * as authService from './services/authService.js'
import * as programService from './services/programService.js'

import { useState, useEffect } from 'react'


const App = () => {
  const navigate = useNavigate();
  const initialState = authService.getUser()

  const [user, setUser] = useState(initialState)
  const [programs, setPrograms] = useState([])

  useEffect(() => {
    if (user) {
      fetchPrograms();
    }
  }, [user]);

  const fetchPrograms = async () => {
    try {
      const data = await programService.index();
      setPrograms(data);
    } catch (err) {
      console.error('Error fetching programs:', err);
    }
  };

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
    authService.signOut();
    setUser(null)
    setPrograms([])
    navigate('/')
  }

  const handleSignIn = async (formData) => {
    // eslint-disable-next-line no-useless-catch
    try {
      const res = await authService.signIn(formData)
      setUser(res)
      navigate('/programs')
    } catch (err) {
      throw err;
    }
  }

  const handleAddProgram = async(formData)=>{
    try {
      const newProgram = await programService.create(formData)
      setPrograms([...programs, newProgram])
      navigate('/programs')
    } catch (err) {
      console.error('Error creating program:', err);
    }
  }

  const handleUpdateProgram = async(formData, programId) => {
    try {
      const updatedProgram = await programService.update(formData, programId)
      setPrograms(programs.map(program => 
        program.id === programId ? updatedProgram : program
      ))
      navigate('/programs')
    } catch (err) {
      console.error('Error updating program:', err);
    }
  }
  
  return (
    <>
      <NavBar user={user} handleSignOut={handleSignOut} />
      <Routes>
          <Route path='/' element={
            user ? <ProgramList programs={programs} /> : <h1>Welcome to GainZ! Please sign in to get started.</h1>
          } />
          <Route path='/programs' element={
            user ? <ProgramList programs={programs} /> : <SignIn handleSignIn={handleSignIn} user={user} />
          } />
          <Route path='/programs/new' element={
            user ? <ProgramForm handleAddProgram={handleAddProgram}/> : <SignIn handleSignIn={handleSignIn} user={user} />
          }/>
          <Route path='/programs/:programId/edit' element={
            user ? <ProgramForm handleUpdateProgram={handleUpdateProgram}/> : <SignIn handleSignIn={handleSignIn} user={user} />
          }/>
          <Route path='/sign-up' element={<SignUp handleSignUp={handleSignUp} user={user} />} />
          <Route path='/sign-in' element={<SignIn handleSignIn={handleSignIn} user={user} />} />
          <Route path='*' element={<h1>404</h1>} />
    </Routes>
    </>
  )
}

export default App


