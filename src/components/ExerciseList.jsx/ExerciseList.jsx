import { useState, useEffect } from 'react';
import * as exerciseService from '../../services/exerciseService';
import './ExerciseList.css';

const ExerciseList = () => {
  const [exercises, setExercises] = useState([]);
  const [filteredExercises, setFilteredExercises] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchExercises();
  }, []);

  useEffect(() => {
    const filtered = exercises.filter(exercise =>
      exercise.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (exercise.muscle_group && exercise.muscle_group.toLowerCase().includes(searchTerm.toLowerCase()))
    );
    setFilteredExercises(filtered);
  }, [exercises, searchTerm]);

  const fetchExercises = async () => {
    try {
      setLoading(true);
      const data = await exerciseService.getAllExercises();
      setExercises(data);
      setError('');
    } catch (err) {
      setError('Failed to load exercises');
      console.error('Error fetching exercises:', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div>Loading exercises...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="exercise-library-container">
      <div className="exercise-library-header">
        <h2>Exercise Library</h2>
      </div>
      
      <div className="search-container">
        <input
          type="text"
          placeholder="Search by name or muscle group..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="search-input"
        />
      </div>

      {filteredExercises.length === 0 ? (
        <div className="no-exercises-found">
          <p>No exercises found{searchTerm ? ` for "${searchTerm}"` : ''}.</p>
        </div>
      ) : (
        <div className="exercise-grid">
          {filteredExercises.map((exercise) => (
            <div key={exercise.id} className="exercise-card">
              <div className="exercise-card-header">
                <h3>{exercise.name}</h3>
              </div>
              <div className="exercise-card-body">
                {exercise.muscle_group && <p><strong>Muscle Group:</strong> {exercise.muscle_group}</p>}
                {exercise.description && <p>{exercise.description}</p>}
                {exercise.instructions && (
                  <div className="instructions">
                    <strong>Instructions:</strong>
                    <p>{exercise.instructions}</p>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ExerciseList;
