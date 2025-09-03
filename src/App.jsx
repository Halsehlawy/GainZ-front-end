import './App.css'
import NavBar from './components/NavBar/NavBar'
import SignUp from './components/SignUp/SignUp'
import SignIn from './components/SignIn/SignIn'
import ProgramForm from './components/ProgramForm/ProgramForm.jsx'
import ProgramList from './components/ProgramList/ProgramList.jsx'
import ProgramDetail from './components/ProgramDetail/ProgramDetail.jsx'
import WorkoutList from './components/WorkoutList/WorkoutList.jsx'
import WorkoutForm from './components/WorkoutForm.jsx/WorkoutForm.jsx'
import WorkoutDetail from './components/WorkoutDetail/WorkoutDetail.jsx'
import ExerciseList from './components/ExerciseList.jsx/ExerciseList.jsx'
import { Route, Routes, useNavigate, Outlet, Navigate } from 'react-router-dom'
import { useState, useEffect } from 'react'
import * as authService from './services/authService.js'
import * as programService from './services/programService.js'


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
  
  const ProtectedRoutes = ({ user }) => {
    return user ? <Outlet /> : <Navigate to="/signin" />;
  };

  return (
    <>
      <NavBar user={user} handleSignOut={handleSignOut} />
      <div className="main-content">
        <Routes>
          <Route path='/' element={
            user ? <ProgramList programs={programs} /> : <h1>Welcome to GainZ! Please sign in to get started.</h1>
          } />
          <Route path='/signup' element={<SignUp handleSignUp={handleSignUp} />} />
          <Route path='/signin' element={<SignIn handleSignIn={handleSignIn} />} />

          <Route element={<ProtectedRoutes user={user} />}>
            <Route path='/programs' element={<ProgramList programs={programs} />} />
            <Route path='/programs/new' element={<ProgramForm />} />
            <Route path='/programs/:programId' element={<ProgramDetail user={user} />} />
            <Route path='/programs/:programId/edit' element={<ProgramForm />} />
            <Route path='/programs/:programId/workouts' element={<WorkoutList />} />
            <Route path='/programs/:programId/workouts/new' element={<WorkoutForm />} />
            <Route path='/programs/:programId/workouts/:workoutId' element={<WorkoutDetail />} />
            <Route path='/programs/:programId/workouts/:workoutId/edit' element={<WorkoutForm />} />
            <Route path='/exercises' element={<ExerciseList />} />
          </Route>
        </Routes>
      </div>
    </>
  );
}

export default App


