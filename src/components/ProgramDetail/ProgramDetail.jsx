import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import * as programService from '../../services/programService';
import * as workoutService from '../../services/workoutService';
import './ProgramDetail.css';

const ProgramDetail = ({ user }) => {
  const { programId } = useParams();
  const navigate = useNavigate();
  const [program, setProgram] = useState(null);
  const [workouts, setWorkouts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      if (programId) {
        try {
          const programData = await programService.show(programId);
          setProgram(programData);
          
          const workoutData = await workoutService.index(programId);
          setWorkouts(workoutData);
          setError('');
        } catch (err) {
          setError('Failed to load program data');
          console.error('Error fetching program data:', err);
        } finally {
          setLoading(false);
        }
      }
    };
    
    fetchData();
  }, [programId]);

  const daysOfWeek = [
    { id: 1, name: 'Sunday' },
    { id: 2, name: 'Monday' },
    { id: 3, name: 'Tuesday' },
    { id: 4, name: 'Wednesday' },
    { id: 5, name: 'Thursday' },
    { id: 6, name: 'Friday' },
    { id: 7, name: 'Saturday' },
  ];

  const workoutsByDay = workouts.reduce((acc, workout) => {
    acc[workout.day_of_week] = workout;
    return acc;
  }, {});

  if (loading) return <div>Loading program...</div>;
  if (error) return <div>Error: {error}</div>;
  if (!program) return <div>Program not found</div>;

  const isOwner = user && user.id === program.user_id;

  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this program?')) {
      try {
        await programService.deleteProgram(programId);
        navigate('/programs');
      } catch (err) {
        console.error('Failed to delete program:', err);
        setError('Failed to delete program.');
      }
    }
  };

  return (
    <div className="program-detail">
      <div className="program-header">
        <h2>{program.name}</h2>
        <div className="program-actions">
          {isOwner && !program.is_default && (
            <>
              <button onClick={() => navigate(`/programs/${programId}/edit`)} className="program-action-btn">
                Edit
              </button>
              <button onClick={handleDelete} className="program-action-btn delete">
                Delete
              </button>
            </>
          )}
          <Link to="/programs" className="program-action-btn">Back to Programs</Link>
        </div>
      </div>

      <div className="workouts-preview">
        <div className="weekly-workout-list">
          {daysOfWeek.map(day => {
            const workout = workoutsByDay[day.id];
            return (
              <div key={day.id} className="day-row">
                <div className="day-name">{day.name}</div>
                <div className="day-content">
                  {workout ? (
                    <div 
                      className="workout-card"
                      onClick={() => navigate(`/programs/${programId}/workouts/${workout.id}`)}
                      role="link"
                      tabIndex="0"
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' || e.key === ' ') {
                          navigate(`/programs/${programId}/workouts/${workout.id}`);
                        }
                      }}
                    >
                      <div className="workout-card-header">
                        <h4>{workout.name}</h4>
                        <p>{workout.exercise_ids?.length || 0} exercises</p>
                      </div>
                    </div>
                  ) : (
                    <div className="workout-placeholder">
                      <span>Rest Day</span>
                      {!program.is_default && (
                        <Link to={`/programs/${programId}/workouts/new?day=${day.id}`}>
                          Add Workout
                        </Link>
                      )}
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default ProgramDetail;
