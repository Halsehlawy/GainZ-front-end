import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import * as workoutService from '../../services/workoutService';
import * as exerciseService from '../../services/exerciseService';
import * as programService from '../../services/programService';
import './WorkoutDetail.css';

const WorkoutDetail = () => {
  const { programId, workoutId } = useParams();
  const [workout, setWorkout] = useState(null);
  const [program, setProgram] = useState(null);
  const [exercises, setExercises] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      if (programId && workoutId) {
        try {
          const [workoutData, programData] = await Promise.all([
            workoutService.show(programId, workoutId),
            programService.show(programId)
          ]);
          
          setWorkout(workoutData);
          setProgram(programData);

          if (workoutData.exercise_ids && workoutData.exercise_ids.length > 0) {
            const allExercises = await exerciseService.getAllExercises();
            const workoutExercises = allExercises.filter(exercise => 
              workoutData.exercise_ids.includes(exercise.id)
            );
            setExercises(workoutExercises);
          }

          setError('');
        } catch (err) {
          setError('Failed to load workout data');
          console.error('Error fetching workout data:', err);
        } finally {
          setLoading(false);
        }
      }
    };
    
    fetchData();
  }, [programId, workoutId]);

  const getDayName = (dayNumber) => {
    const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    return days[dayNumber - 1] || `Day ${dayNumber}`;
  };

  if (loading) return <div>Loading workout...</div>;
  if (error) return <div>Error: {error}</div>;
  if (!workout) return <div>Workout not found</div>;

  return (
    <div className="workout-detail-container">
      <div className="workout-detail-header">
        <div>
          <h2>{workout.name}</h2>
          <span className="workout-day">{getDayName(workout.day_of_week)}</span>
        </div>
        <div className="workout-detail-actions">
          <Link to={`/programs/${programId}`} className="back-to-program-link">Back to Program</Link>
          {!program?.is_default && (
            <Link to={`/programs/${programId}/workouts/${workoutId}/edit`} className="edit-workout-link">Edit Workout</Link>
          )}
        </div>
      </div>

      <div className="exercise-list-container">
        <h3>Exercises ({exercises.length})</h3>
        {exercises.length === 0 ? (
          <div className="no-exercises-message">
            <p>No exercises have been added to this workout yet.</p>
            {!program?.is_default && (
              <Link to={`/programs/${programId}/workouts/${workoutId}/edit`} className="add-exercises-link">Add Exercises</Link>
            )}
          </div>
        ) : (
          <div className="exercise-list">
            {exercises.map((exercise) => (
              <div key={exercise.id} className="exercise-card">
                <div className="exercise-details">
                  <h4>{exercise.name}</h4>
                  <div className="exercise-stats">
                    {exercise.sets && <span>{exercise.sets} sets</span>}
                    {exercise.reps && <span>{exercise.reps} reps</span>}
                    {exercise.weight && <span>{exercise.weight}</span>}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default WorkoutDetail;
