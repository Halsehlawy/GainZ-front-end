import { useState, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import * as workoutService from '../../services/workoutService';
import * as programService from '../../services/programService';
import './WorkoutList.css';

const WorkoutList = () => {
  const { programId } = useParams();
  const [workouts, setWorkouts] = useState([]);
  const [program, setProgram] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (programId) {
      fetchWorkouts();
      fetchProgram();
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [programId]);

  const fetchWorkouts = async () => {
    try {
      setLoading(true);
      const data = await workoutService.index(programId);
      setWorkouts(data);
      setError('');
    } catch (err) {
      setError('Failed to load workouts');
      console.error('Error fetching workouts:', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchProgram = async () => {
    try {
      const data = await programService.show(programId);
      setProgram(data);
    } catch (err) {
      console.error('Error fetching program:', err);
    }
  };

  const handleDeleteWorkout = async (workoutId) => {
    if (window.confirm('Are you sure you want to delete this workout?')) {
      try {
        await workoutService.deleteWorkout(programId, workoutId);
        fetchWorkouts();
      } catch (err) {
        setError('Failed to delete workout');
        console.error('Error deleting workout:', err);
      }
    }
  };

  if (loading) return <div>Loading workouts...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="workout-list">
      <div className="workout-header">
        <h2>Workouts for {program?.name}</h2>
        <Link to={`/programs/${programId}`}>Back to Program</Link>
      </div>

      <Link to={`/programs/${programId}/workouts/new`} 
            style={program?.is_default ? {pointerEvents: 'none', opacity: 0.5} : {}}>
        {program?.is_default ? 'Cannot Create Workout (Default Program)' : 'Create New Workout'}
      </Link>

      {workouts.length === 0 ? (
        <div>
          <p>No workouts found for this program.</p>
          {!program?.is_default && (
            <Link to={`/programs/${programId}/workouts/new`}>Create Workout</Link>
          )}
        </div>
      ) : (
        <div className="workouts">
          {workouts.map((workout) => (
            <div key={workout.id} className="workout-item">
              <h3>{workout.name}</h3>
              <p>Day {workout.day_of_week}</p>
              <p>{workout.exercise_ids?.length || 0} exercises</p>
              
              <div className="workout-actions">
                <Link to={`/programs/${programId}/workouts/${workout.id}`}>View</Link>
                <Link to={`/programs/${programId}/workouts/${workout.id}/exercises`}>Exercises</Link>
                {!program?.is_default && (
                  <>
                    <Link to={`/programs/${programId}/workouts/${workout.id}/edit`}>Edit</Link>
                    <button onClick={() => handleDeleteWorkout(workout.id)}>
                      Delete
                    </button>
                  </>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default WorkoutList;
