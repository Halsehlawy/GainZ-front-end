import { useState, useEffect } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import * as workoutService from '../../services/workoutService';
import * as exerciseService from '../../services/exerciseService';
import * as programService from '../../services/programService';
import './WorkoutForm.css';

const WorkoutForm = () => {
  const { programId, workoutId } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const dayFromQuery = queryParams.get('day');

  const initialState = {
    name: '',
    day_of_week: dayFromQuery ? parseInt(dayFromQuery) : 1, 
    exercise_ids: [],
  };
  const [formData, setFormData] = useState(initialState);
  const [allExercises, setAllExercises] = useState([]);
  const [loading, setLoading] = useState(true);
  const [program, setProgram] = useState(null);

  useEffect(() => {
    const initializeForm = async () => {
      try {
        setLoading(true);
        const programData = await programService.show(programId);
        setProgram(programData);

        if (programData.is_default) {
          setLoading(false);
          return;
        }

        const exercisesData = await exerciseService.getAllExercises();
        setAllExercises(exercisesData);

        if (workoutId) {
          const workoutData = await workoutService.show(programId, workoutId);
          setFormData(workoutData);
        }
      } catch (err) {
        console.error('Error initializing form:', err);
      } finally {
        setLoading(false);
      }
    };

    initializeForm();
  }, [programId, workoutId, dayFromQuery]);

  const handleChange = (evt) => {
    const value = evt.target.name === 'day_of_week' ? parseInt(evt.target.value) : evt.target.value;
    setFormData({ ...formData, [evt.target.name]: value });
  };

  const handleExerciseToggle = (exerciseId) => {
    const currentIds = formData.exercise_ids;
    const newIds = currentIds.includes(exerciseId)
      ? currentIds.filter(id => id !== exerciseId)
      : [...currentIds, exerciseId];
    
    setFormData({ ...formData, exercise_ids: newIds });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      if (workoutId) {
        await workoutService.update(formData, programId, workoutId);
      } else {
        await workoutService.create(formData, programId);
      }
      navigate(`/programs/${programId}`);
    } catch (err) {
      console.error('Error saving workout:', err);
    }
  };

  const dayOptions = [
    { value: 1, label: 'Sunday' },
    { value: 2, label: 'Monday' },
    { value: 3, label: 'Tuesday' },
    { value: 4, label: 'Wednesday' },
    { value: 5, label: 'Thursday' },
    { value: 6, label: 'Friday' },
    { value: 7, label: 'Saturday' }
  ];

  if (loading) return <div>Loading...</div>;
  
  if (program?.is_default) {
    return (
      <div className="form-container default-program-message">
        <div className="form-header">
          <h2>Cannot Edit Default Program</h2>
        </div>
        <p>Default programs and their workouts are not editable.</p>
        <div className="form-actions">
          <button onClick={() => navigate(`/programs/${programId}`)} className="form-button secondary">
            Back to Program
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="form-container">
      <div className="form-header">
        <h2>{workoutId ? 'Edit Workout' : 'Create New Workout'}</h2>
      </div>
      
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="name">Workout Name</label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
            placeholder="e.g., 'Chest & Triceps'"
            className="form-input"
          />
        </div>

        {(workoutId || !dayFromQuery) && (
          <div className="form-group">
            <label htmlFor="day_of_week">Day of the Week</label>
            <select
              id="day_of_week"
              name="day_of_week"
              value={formData.day_of_week}
              onChange={handleChange}
              required
              className="form-select"
            >
              {dayOptions.map(day => (
                <option key={day.value} value={day.value}>
                  {day.label}
                </option>
              ))}
            </select>
          </div>
        )}

        <div className="form-group">
          <label>Select Exercises</label>
          <div className="exercise-selection-container">
            {allExercises.map(exercise => (
              <div
                key={exercise.id}
                className="exercise-checkbox-item"
                onClick={() => handleExerciseToggle(exercise.id)}
              >
                <input
                  type="checkbox"
                  id={`exercise-${exercise.id}`}
                  checked={formData.exercise_ids?.includes(exercise.id) || false}
                  readOnly
                />
                <span className="custom-checkbox">
                  <span className="checkmark"></span>
                </span>
                <label htmlFor={`exercise-${exercise.id}`}>
                  {exercise.name}
                </label>
              </div>
            ))}
          </div>
        </div>
        
        <div className="form-actions">
          <button 
            type="button" 
            onClick={() => navigate(workoutId ? `/programs/${programId}/workouts/${workoutId}` : `/programs/${programId}`)}
            className="form-button secondary"
          >
            Cancel
          </button>
          <button type="submit" className="form-button primary">
            {workoutId ? 'Save Changes' : 'Create Workout'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default WorkoutForm;
