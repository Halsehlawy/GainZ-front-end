import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import * as programService from '../../services/programService';
import './ProgramList.css';

const ProgramList = () => {
  const [programs, setPrograms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchPrograms();
  }, []);

  const fetchPrograms = async () => {
    try {
      setLoading(true);
      const data = await programService.index();
      setPrograms(data);
      setError('');
    } catch (err) {
      setError('Failed to load programs');
      console.error('Error fetching programs:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteProgram = async (programId) => {
    if (window.confirm('Are you sure you want to delete this program?')) {
      try {
        await programService.deleteProgram(programId);
        fetchPrograms();
      } catch (err) {
        setError('Failed to delete program');
        console.error('Error deleting program:', err);
      }
    }
  };

  if (loading) return <div>Loading programs...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="program-list">
      <h2>Programs</h2>
      <Link to="/programs/new">Create New Program</Link>

      {programs.length === 0 ? (
        <div>
          <p>No programs found.</p>
          <Link to="/programs/new">Create Program</Link>
        </div>
      ) : (
        <div className="programs">
          {programs.map((program) => (
            <div key={program.id} className="program-item">
              <h3>{program.name}</h3>
              <p>{program.user_id ? 'Your Program' : 'Default Program'}</p>
              
              <div className="program-actions">
                <Link to={`/programs/${program.id}`}>View</Link>
                <Link to={`/programs/${program.id}/edit`}>Edit</Link>
                <Link to={`/programs/${program.id}/workouts`}>Workouts</Link>
                {program.user_id && (
                  <button onClick={() => handleDeleteProgram(program.id)}>
                    Delete
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ProgramList;
